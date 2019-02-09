import { provideDb } from "./lib/curried";
import { getUserFromDb } from "./lib/getUserFromDb";

import { default as getTopicsHandler } from "./src/topics/getTopics";
import { default as getTopicHandler } from "./src/topics/getTopic";
import { default as createTopicHandler } from "./src/topics/createTopic";
import { default as deleteTopicHandler } from "./src/topics/deleteTopic";
import { default as updateTopicHandler } from "./src/topics/updateTopic";

import { default as meHandler } from "./src/users/me";
import { default as createUserHandler } from "./src/users/createUser";

import { default as createSubscriptionHandler } from "./src/subscriptions/createSubscription";
import { default as unsubscribeHandler } from "./src/subscriptions/unsubscribe";

import { default as createNotificationHandler } from "./src/notifications/createNotification";

export const getTopics = provideDb(getTopicsHandler);
export const getTopic = provideDb(getTopicHandler);
export const createTopic = provideDb(getUserFromDb(createTopicHandler));
export const deleteTopic = provideDb(getUserFromDb(deleteTopicHandler));
export const updateTopic = provideDb(getUserFromDb(updateTopicHandler));

export const createUser = provideDb(createUserHandler);
export const me = provideDb(getUserFromDb(meHandler));

export const createSubscription = provideDb(
  getUserFromDb(createSubscriptionHandler)
);
export const unsubscribe = provideDb(getUserFromDb(unsubscribeHandler));

export const createNotification = provideDb(
  getUserFromDb(createNotificationHandler)
);
