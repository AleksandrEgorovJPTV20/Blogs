const express = require('express');
const User = require('../models/User'); // Import the User model
const Subscription = require('../models/Subscription'); // Import the Subscription model
const UserSubscription = require('../models/UserSubscription'); // Import the UserSubscription model
const asyncHandler = require('express-async-handler');

// POST /api/subscription
const updateUserSubscription = asyncHandler(async (req, res) => {
  const userId = req.userId; // Extract the user's ID from the decoded token
  const selectedPlan = req.body.selectedPlan.trim().toLowerCase()
  console.log('Selected Plan:', selectedPlan);

  //Читаем пользователя
  const user = await User.findById(userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  //Читаем подписку
  const subscription = await Subscription.findOne({ type: selectedPlan });

  if (!subscription) {
    return res.status(400).json({ message: 'Invalid subscription plan' });
  }

  //Проверка кол-во денег юзера чтобы купить подписку
  const subscriptionPrice = parseFloat(subscription.price);
  
  if (user.money < subscriptionPrice) {
    return res.status(400).json({ message: 'Insufficient funds' });
  }

  // создаём историю подписки
  const userSubscription = new UserSubscription({
    userId: user._id,
    subscriptionId: subscription._id,
    startDate: new Date(), // Set the start date to the current date
    expirationDate: calculateExpirationDate(selectedPlan), // Calculate the expiration date
  });

  //обновляем ид подписки пользователя
  user.subscriptionId = userSubscription._id;

  //Вычитаем деньги
  user.money -= subscriptionPrice;

  // Сохраняем новую историю подписки и обновить юзера
  await Promise.all([user.save(), userSubscription.save()]);

  res.status(200).json({ message: 'Subscription updated successfully' });
});

//Функция вычисления даты окончания 
function calculateExpirationDate(selectedPlan) {
  const daysToAdd = selectedPlan === 'monthly' ? 30 : selectedPlan === 'yearly' ? 365 : 0;
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysToAdd);
  return expirationDate;
}


module.exports = {
    updateUserSubscription
}