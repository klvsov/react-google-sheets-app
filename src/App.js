import { useRef, useState } from 'react';
import {
  Button,
  Container,
  Grid,
  Input,
  Snackbar,
  Typography,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

const TEXT_DATA_EXP = /^[0-9a-zA-Z]{3,}/i;
const NUM_DATA_EXP = /^[0-9]{2,}/i;
const SALARY_DATA_EXP = /^[0-9]{3,}/i;

const App = () => {
  const [name, setName] = useState(' ');
  const [age, setAge] = useState(' ');
  const [salary, setSalary] = useState(' ');
  const [hobby, setHobby] = useState(' ');
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState('success');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const inputName = useRef(null);
  const inputAge = useRef(null);
  const inputSalary = useRef(null);
  const inputHobby = useRef(null);

  const postData = { name, age, salary, hobby };

  const setValidate = (text, exp) => {
    return exp.test(text);
  };

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };

  const inputNameHandler = (event) => {
    const nameValue = setValidate(event.target.value.trim(), TEXT_DATA_EXP);
    nameValue ? setName(event.target.value.trim()) : setName('');
  };

  const inputAgeHandler = (event) => {
    const ageValue = setValidate(event.target.value.trim(), NUM_DATA_EXP);
    ageValue ? setAge(event.target.value.trim()) : setAge('');
  };

  const inputSalaryHandler = (event) => {
    const salaryValue = setValidate(event.target.value.trim(), SALARY_DATA_EXP);
    salaryValue ? setSalary(event.target.value.trim()) : setSalary('');
  };

  const inputHobbyHandler = (event) => {
    const hobbyValue = setValidate(event.target.value.trim(), TEXT_DATA_EXP);
    hobbyValue ? setHobby(event.target.value.trim()) : setHobby('');
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();
    if (
      name &&
      name !== ' ' &&
      age &&
      age !== ' ' &&
      salary &&
      salary !== ' ' &&
      hobby &&
      hobby !== ' '
    ) {
      setLoading(true);
      axios
        .post(
          'https://sheet.best/api/sheets/8fdee7bd-d79c-4255-afaa-2813a311f09d',
          postData
        )
        .then((response) => {
          setLoading(false);
          setMessage('Your data has been saved successfully!');
          if (response.status === 200) {
            inputName.current.children[0].value = '';
            inputAge.current.children[0].value = '';
            inputSalary.current.children[0].value = '';
            inputHobby.current.children[0].value = '';
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              setResult('success');
            }, 3000);
          } else {
            setName('');
            setAge('');
            setSalary('');
            setHobby('');
          }
        })
        .catch((error) => {
          setLoading(false);
          setMessage(error.message);
          setResult('error');
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            setResult('success');
          }, 3000);
        });
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" style={{ textAlign: 'center' }}>
        React Google Sheets App
      </Typography>
      <form onSubmit={formSubmitHandler}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <p>
              <label htmlFor="name">Name</label>
            </p>
            <Input
              style={{ width: '100%' }}
              id="name"
              placeholder="Enter your name"
              type="text"
              onChange={inputNameHandler}
              error={!name ? true : false}
              ref={inputName}
            />
            <p>
              <label htmlFor="age">Age</label>
            </p>
            <Input
              style={{ width: '100%' }}
              id="age"
              placeholder="Enter your age"
              type="number"
              onChange={inputAgeHandler}
              error={!age ? true : false}
              ref={inputAge}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <p>
              <label htmlFor="salary">Salary</label>
            </p>
            <Input
              style={{ width: '100%' }}
              id="salary"
              placeholder="Enter your salary"
              type="number"
              onChange={inputSalaryHandler}
              error={!salary ? true : false}
              ref={inputSalary}
            />
            <p>
              <label htmlFor="hobby">Hobby</label>
            </p>
            <Input
              style={{ width: '100%' }}
              id="hobby"
              placeholder="Enter your hobby"
              type="text"
              onChange={inputHobbyHandler}
              error={!hobby ? true : false}
              ref={inputHobby}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginTop: '2rem', position: 'relative' }}
        >
          Send data
          {loading && (
            <CircularProgress
              style={{ position: 'absolute', right: '-35px' }}
              size={30}
            />
          )}
        </Button>
      </form>

      <Snackbar open={success}>
        <Alert severity={result}>{message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
