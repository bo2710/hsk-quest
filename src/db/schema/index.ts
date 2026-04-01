export const dbSchema = {
  // --- USER & SETTINGS ---
  profiles: 'id, username',
  dailyStates: '[userId+date]', 
  
  // --- CONTENT ---
  courses: 'id',
  units: 'id, courseId',
  lessons: 'id, unitId, type',
  contentItems: 'id, hskLevel, type',
  
  // --- PROGRESS ---
  itemProgress: '[userId+itemId], nextReviewDate, state', 
  skillProgress: '[userId+skillType]',
  
  // --- GAMIFICATION & LOGS ---
  userAchievements: '[userId+achievementId]',
  questProgress: '[userId+cycleId]',
  sessionLogs: 'id, userId, startTime'
};