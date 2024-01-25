// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { Client } from 'https://deno.land/x/notion_sdk/src/mod.ts'

const notion = new Client({
  auth: Deno.env.get('NOTION_TOKEN')
})

Deno.serve(async (req) => {
  try {
    const tasks = await notion.databases.query({
      database_id: 'ea7892e7a1b44a10ba5099fed0adce20'
    })
    const data = tasks.results

    const { username } = await req.json()
    // console.log('username', username)

    const filteredData = data.filter((item) => item?.properties?.Username?.rich_text[0]?.plain_text === username)
    // console.log('Отфильтрованные данные:', filteredData)

    const responseData = {
      user_id: filteredData[0].created_by.id
    }
    // console.log('Ответные данные:', responseData)

    return new Response(JSON.stringify(responseData), { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Ошибка при обработке JSON:', error)
    return new Response('Ошибка при обработке JSON', { status: 500 })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-user-id' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
