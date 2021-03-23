import { DatabasePoolConnectionType, sql } from 'slonik'

interface CalculateRequest {
  operator: string
  left: string
  right: string
}

interface CalculateResult {
  requestId: number
  result: string
}

interface StoredCalculateResult extends CalculateResult {
  id: number
}

interface StoredCalculateRequest extends CalculateRequest {
  id: number
}

type AddRequest = (
  pool: DatabasePoolConnectionType,
  args: CalculateRequest
) => Promise<StoredCalculateRequest>

type GetRequest = (
  pool: DatabasePoolConnectionType,
  id: number
) => Promise<StoredCalculateRequest | null>

type UnhandledRequests = (
  pool: DatabasePoolConnectionType
) => Promise<readonly StoredCalculateRequest[]>

type AddResult = (
  pool: DatabasePoolConnectionType,
  args: CalculateResult
) => Promise<StoredCalculateResult>

type TruncateRequests = (pool: DatabasePoolConnectionType) => Promise<void>

type TruncateResults = (pool: DatabasePoolConnectionType) => Promise<void>

export const addRequest: AddRequest = async (pool, { left, right, operator }) =>
  pool.one<StoredCalculateRequest>(sql`
    INSERT INTO 
      calculator_requests (left_operand, right_operand, operator) 
    VALUES
      (${left}, ${right}, ${operator})
    RETURNING 
      left_operand as left, 
      right_operand as right, 
      operator, 
      id
  `)

export const getRequest: GetRequest = async (pool, id) =>
  pool.maybeOne<StoredCalculateRequest>(sql`
    SELECT 
      left_operand as left, 
      right_operand as right, 
      operator,
      id 
    FROM 
      calculator_requests 
    WHERE 
      id = ${id}
  `)

export const unhandledRequests: UnhandledRequests = async (pool) =>
  pool.any<StoredCalculateRequest>(sql`
    SELECT
      req.left_operand as left,
      req.right_operand as right,
      req.operator,
      req.id
    FROM
      calculator_requests as req
    LEFT JOIN
      calculator_results as res
    ON
      req.id = res.request_id
    WHERE   
      res.request_id IS NULL
  `)

export const addResult: AddResult = async (pool, { requestId, result }) =>
  pool.one<StoredCalculateResult>(sql`
    INSERT INTO 
      calculator_results (request_id, result) 
    VALUES
      (${requestId}, ${result})
    RETURNING 
      request_id as requestId, 
      result, 
      id
  `)

export const truncateRequests: TruncateRequests = async (pool) => {
  await pool.query<null>(sql`TRUNCATE calculator_requests RESTART IDENTITY`)
}

export const truncateResults: TruncateResults = async (pool) => {
  await pool.query<null>(sql`TRUNCATE calculator_results RESTART IDENTITY`)
}
