import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

import userRouter from './routes/user.js';
import experienceRouter from './routes/experience.js';
import educationRouter from './routes/education.js';
import skillRouter from './routes/skill.js';
import projectRouter from './routes/project.js';
import resumeRouter from './routes/resume.js';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

mongoose.connect(process.env.DB_URI).then(
  () => console.log('Database connected'),
  err => console.log('Error connecting database ', err)
);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
export const openai = new OpenAIApi(configuration);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/user', userRouter);
app.use('/experience', experienceRouter);
app.use('/education', educationRouter);
app.use('/project', projectRouter);
app.use('/skill', skillRouter);
app.use('/resume', resumeRouter);

app.get('/', async (req, res) => {
  res.send('Server up and running');
});

app.all('*', async (req, res) => {
  res.status(404).send({ success: false, message: 'Url not found!' });
});

app.use((err, req, res, next) => {
  const { status_code = 500 } = err;
  if (!err.error) err.error = 'internal_server_error';
  res.status(status_code).send({
    success: false,
    error: err.error
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening to port: ${PORT}`);
});
