import {
  runRecommendationAgent,
  runProjectPlanningAgent,
  generateProjectRoadmap,
  runImprovementAgent,
  runMentorAgent,
  getLearningResources,
  generateCheckpointQuiz,
  runAnalyticsAgent
} from './agents.js';

/**
 * Intelligent Router classifying intents and delegating to specialized agents
 */
export async function dispatchAgentRoute({ intent, payload, apiKey = null }) {
  const normalizedIntent = (intent || 'RECOMMENDATION').toUpperCase();

  switch (normalizedIntent) {
    case 'PROJECT IDEA':
    case 'RECOMMENDATION':
      return {
        agent: 'RecommendationAgent',
        data: await runRecommendationAgent(payload.profile, apiKey)
      };

    case 'PROJECT PLANNING':
    case 'BLUEPRINT':
      return {
        agent: 'ProjectPlanningAgent',
        data: await runProjectPlanningAgent(payload.project, payload.profile || {}, apiKey)
      };

    case 'ROADMAP':
      return {
        agent: 'RoadmapAgent',
        data: generateProjectRoadmap(payload.project)
      };

    case 'PROJECT IMPROVEMENT':
    case 'IMPROVEMENT':
      return {
        agent: 'ImprovementAgent',
        data: await runImprovementAgent(payload, apiKey)
      };

    case 'GENERAL QUESTION':
    case 'LEARNING QUESTION':
    case 'MENTOR':
      return {
        agent: 'MentorAgent',
        data: await runMentorAgent(payload, apiKey)
      };

    case 'RESOURCES':
    case 'LEARNING':
      return {
        agent: 'LearningAgent',
        data: getLearningResources(payload.skills, payload.tech)
      };

    case 'ASSESSMENT':
    case 'QUIZ':
      return {
        agent: 'AssessmentAgent',
        data: generateCheckpointQuiz(payload.technologies)
      };

    case 'PROGRESS ANALYSIS':
    case 'ANALYTICS':
      return {
        agent: 'AnalyticsAgent',
        data: runAnalyticsAgent(payload.profile, payload.project)
      };

    default:
      return {
        agent: 'MentorAgent',
        data: await runMentorAgent({ message: payload.message || 'Help me with my project' }, apiKey)
      };
  }
}
