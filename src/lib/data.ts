// Data loading utilities for centralized content management

import personalData from '../../data/personal.json'
import experiencesData from '../../data/experiences.json'
import config from '../../data/config.json'

export interface PersonalInfo {
  name: string
  firstName: string
  lastName: string
  birthday: string
  age: {
    calculate: boolean
    birthDate: string
  }
  title: string
  shortDescription: string
  aboutText: string
  skills: string[]
  contact: {
    email: string
    linkedin: string
    github: string
    website: string
  }
}

export interface Experience {
  id: string
  logo: string // Path to logo image file (e.g., "/logos/company.ico")
  name: string
  position: string
  company: string
  startDate: string
  endDate: string
  years: string
  current: boolean
  description: string
  technologies: string[]
  highlights: string[]
}

export interface ExperiencesData {
  experiences: Experience[]
}

// Calculate age from birth date
export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

// Get personal information
export function getPersonalInfo(): PersonalInfo {
  return personalData
}

// Get calculated age
export function getCurrentAge(): number {
  const personal = getPersonalInfo()
  return calculateAge(personal.age.birthDate)
}

// Get all experiences
export function getExperiences(): Experience[] {
  return experiencesData.experiences
}

// Get specific experience by ID
export function getExperience(id: string): Experience | undefined {
  return experiencesData.experiences.find(exp => exp.id === id)
}

// Get site configuration
export function getSiteConfig() {
  return config
}


// Get experience by name (for @ mentions)
export function getExperienceByName(name: string): Experience | undefined {
  return experiencesData.experiences.find(exp => 
    exp.name.toLowerCase().includes(name.toLowerCase())
  )
}

// Search experiences (for autocomplete)
export function searchExperiences(query: string): Experience[] {
  const searchTerm = query.toLowerCase()
  return experiencesData.experiences.filter(exp =>
    exp.name.toLowerCase().includes(searchTerm) ||
    exp.company.toLowerCase().includes(searchTerm) ||
    exp.position.toLowerCase().includes(searchTerm)
  )
}
