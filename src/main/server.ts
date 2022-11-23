import express from 'express'

const app = express()

app.listen(6363, () => {
  console.log('Server running at http://localhost:6363')
})
