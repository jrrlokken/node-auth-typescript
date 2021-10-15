import mongoose from 'mongoose';

export default async function dbConnect (): Promise<void> {
  mongoose
    // @ts-ignore
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    .then(() => {
      console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch(error => {
      console.log('Unable to connect to MongoDB Atlast!');
      console.error(error);
    });
}
