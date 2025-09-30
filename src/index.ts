import cors from 'cors';
import express from 'express'

import { router } from './routes/route'

export const app = express()
app.use(cors());


const PORT = process.env.PORT || 3000



app.use(express.json())
app.use('/' , router)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
