import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = 'https://test.ambel.ca/api';

// See https://k6.io/docs/using-k6/k6-options/
export const options = {
  vus: 3,
  duration: '1m',
  ext: {
    loadimpact: {
      name: 'Smoke Test',
    },
  },
}

export default function () {
  const data = { email: 'ourpacificrim@gmail.com', password: 'Ta@91912113' }
  let loginRes = http.post(`${BASE_URL}/users/signin`, JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })

  check(loginRes, { 'success login': (r) => r.status === 200 })
  console.log(`Status Code: ${loginRes.status} - Response Body: ${loginRes.body}`)
  sleep(1)
}