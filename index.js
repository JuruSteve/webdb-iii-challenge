const express = require('express')
const helmet = require('helmet')
const knex = require('knex')
const knexConfig = require('./knexfile')

const db = knex(knexConfig.development)
const server = express()

server.use(express.json())
server.use(helmet())

// Cohorts endpoints here
server.post('/api/cohorts', (req, res) => {
  const newcohort = req.body
  // console.log(newcohort)
  // return
  if (!newcohort.name || newcohort.name === '') {
    res.status(400).json({ errorMessage: 'Please provide a name to add a cohort.' })
  } else {
    db.insert(newcohort, 'id')
      .into('cohorts')
      .then(id => {
        console.log(id)
        res.status(201).json(id)
      })
      .catch(e => {
        res.status(500).json({ error: 'A new cohort could not be added.', e: e })
      })
  }
})

server.get('/api/cohorts', async (req, res) => {
  try {
    const cohorts = await db.select('*').from('cohorts')
    res.status(200).json(cohorts)
  } catch (e) {
    res.status(500).json({ errorMessage: 'Could not retrieve a list of cohorts' })
  }
})

server.get('/api/cohorts/:id', async (req, res) => {
  try {
    const id = req.params.id
    const cohort = await db('cohorts').where({ id }).first()
    if (cohort) {
      res.status(200).json(cohort)
    } else {
      res.status(404).json({ errorMessage: `Could not retrieve a post with id: ${id}` })
    }
  } catch (e) {
    res.status(500).json({ errorMessage: `Could not retrieve a cohort with id:${id}` })
  }
})

server.delete('/api/cohorts/:id', async (req, res) => {
  const id = req.params.id
  try {
    const cohort = await db('cohorts').where({ id }).del()
    // res.status(200).json(cohort && !cohort.length < 1 ? cohort : 'No cohorts available')
    res.status(200).json(cohort)
  } catch (e) {
    res.status(500).json({ errorMessage: `Could not delete a cohort with id:${id}` })
  }
})

server.put('/api/cohorts/:id', async (req, res) => {
  const id = req.params.id
  const newcohort = req.body
  if (!newcohort.name || newcohort.name === '') {
    res.status(400).json({ errorMessage: 'Please provide a name to add a cohort.' })
  } else {
    try {
      const cohort = await db('cohorts').where({ id }).update(newcohort)
      res.status(200).json(cohort)
    } catch (e) {
      res.status(500).json({ errorMessage: `Could not update the cohort with id:${id}` })
    }
  }
})

// students endpoints here

server.get('/api/students', async (req, res) => {
  try {
    const students = await db('students')
    res.status(200).json(students)
  } catch (e) {
    res.status(500).json({ errorMessage: 'Could not retrieve a list of students' })
  }
})
server.get('/api/students/:id', async (req, res) => {
  try {
    const id = req.params.id
    const students = await db('students').where({ id }).first()
    if (students) {
      res.status(200).json(students)
    } else {
      res.status(404).json({ errorMessage: 'Could not retrieve a student with that id' })
    }
  } catch (e) {
    res.status(500).json({ errorMessage: 'Could not retrieve a student' })
  }
})

server.post('/api/students', async (req, res) => {
  const newstudent = req.body
  if (!newstudent.name || newstudent.name === '') {
    res.status(400).json({ errorMessage: 'Please provide a name to add a cohort.' })
  } else {
    try {
      const students = await db('students').insert(newstudent, 'id')
      res.status(201).json(students)
    } catch (e) {
      res.status(500).json({ errorMessage: 'Could not a student' })
    }
  }
})

server.put('/api/students/:id', async (req, res) => {
  const newstudent = req.body
  if (!newstudent.name || newstudent.name === '') {
    res.status(400).json({ errorMessage: 'Please provide a name to update a cohort.' })
  } else {
    try {
      const id = req.params.id
      const students = await db('students').where({ id }).update(newstudent)
      res.status(200).json(students)
    } catch (e) {
      res.status(500).json({ errorMessage: 'Could not update a list of students' })
    }
  }
})

server.delete('/api/students/:id', async (req, res) => {
  try {
    const id = req.params.id
    const students = await db('students').where({ id }).del()
    res.status(200).json(students)
  } catch (e) {
    res.status(500).json({ errorMessage: 'Could not delete this students' })
  }
})

const port = 3300
server.listen(port, function () {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`)
})
