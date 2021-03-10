CREATE TABLE IF NOT EXISTS calculator_requests (
  id SERIAL,
  left_operand varchar(100) NOT NULL,
  right_operand varchar(100) NOT NULL,
  operator varchar(3) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS calculator_results (
  id SERIAL,
  request_id integer,
  result varchar(100) NOT NULL,
  PRIMARY KEY (id)
);
