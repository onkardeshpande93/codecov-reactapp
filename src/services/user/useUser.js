import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import Api from 'shared/api'

const currentUserFragment = `
fragment CurrentUserFragment on Me {
  email
  privateAccess
  onboardingCompleted
  businessEmail
  user {
    name
    username
    avatarUrl
    avatar: avatarUrl
    student
    studentCreatedAt
    studentUpdatedAt
    cannySSOToken
  }
  trackingMetadata {
    service
    ownerid
    serviceId
    plan
    staff
    hasYaml
    service
    bot
    delinquent
    didTrial
    planProvider
    planUserCount
    createdAt: createstamp
    updatedAt: updatestamp
    profile {
      createdAt
      otherGoal
      typeProjects
      goals
    }
  }
}
`

export function useUser(options = {}) {
  const { provider } = useParams()

  const query = `
    query CurrentUser {
      me {
        ...CurrentUserFragment
      }
    }
    ${currentUserFragment}
  `

  return useQuery(
    ['currentUser', provider],
    async () => {
      try {
        const { data } = await Api.graphql({ provider, query })
        const currentUser = data?.me

        if (currentUser) return currentUser
        throw new Error('Unauthenticated')
      } catch (e) {
        console.error(e)
      }
    },
    {
      enabled: provider !== undefined,
      ...options,
    }
  )
}