import { DatabasePoolConnectionType, sql } from 'slonik'

interface CalculateArguments {
  operator: string
  left: string
  right: string
}

interface StoredCalculateArgumants extends CalculateArguments {
  id: number
}

type AddRequest = (
  pool: DatabasePoolConnectionType,
  args: CalculateArguments
) => Promise<StoredCalculateArgumants>

type GetRequest = (
  pool: DatabasePoolConnectionType,
  id: number
) => Promise<StoredCalculateArgumants>

export const addRequest: AddRequest = async (
  pool,
  { left, right, operator }
) => {
  const result = await pool.query<StoredCalculateArgumants>(sql`
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
  return result.rows[0] as StoredCalculateArgumants
}

export const getRequest: GetRequest = async (pool, id) => {
  const result = await pool.query<StoredCalculateArgumants>(sql`
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
  return result.rows[0] as StoredCalculateArgumants
}
