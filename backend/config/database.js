require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Create a backup after connecting to the database
        createBackup();

    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};


const createBackup = async () => {
    const collections = await mongoose.connection.db.collections(); //Получаем все коллекции из базы данных
    const backupData = {};

    //Перебираем каждую коллекцию
    for (const collection of collections) {
        const name = collection.collectionName; //Для каждой коллекции извлекается ее имя. Это имя используется в качестве ключа в объекте backupData для организации данных.
        const data = await collection.find({}).toArray(); //Извлекаются все записи из текущей коллекции. Преобразуем результат запроса в массив объектов
        backupData[name] = data;
    }

    //Заполняем данные файл в JSON формате
    const backupFilePath = path.join(__dirname, 'backup.json');
    fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2)); //Используется для преобразования объекта JavaScript в строку JSON. Аргументы null и 2 используются для форматирования JSON с отступами.
    console.log('Backup created at', backupFilePath);
};

module.exports = connectDB;