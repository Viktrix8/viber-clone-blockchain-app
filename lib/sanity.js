import sanityClient from '@sanity/client'

export const client = sanityClient({
  apiVersion: 'v1',
  dataset: 'production',
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: false,
})
