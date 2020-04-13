import React, {FC, useState, useContext, useEffect} from 'react';
import {
  CssBaseline,
  makeStyles,
  Container,
  Paper,
  Divider,
  TextField,
  Button,
} from '@material-ui/core';
import {Redirect} from 'react-router-dom';
import {authContext} from '../contexts/AuthContext';
import {I18nContext} from '../contexts/I18nContext';
import {queryContext} from '../contexts/QueryContext';
import {rootContext} from '../contexts/RootContext';
import InfoDialog from '../components/common/Dialog';
// import {PATH_BI} from '../utils/Endpoints';

const genTheme = (theme: any) => ({
  paper: {
    marginTop: theme.spacing(20),
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.background.paper,
  },
  title: {
    padding: theme.spacing(4, 4, 0, 4),
    fontFamily: 'NotoSansCJKsc-Regular,NotoSansCJKsc',
    fontWeight: '400',
    margin: theme.spacing(0, 0, 2, 0),
  },
  divider: {
    height: '2px',
  },
  info: {
    padding: theme.spacing(4),
  },
  submit: {
    margin: theme.spacing(3, 0, 0, 0),
  },
});
const Login: FC = () => {
  const {nls} = useContext(I18nContext);
  const {auth, setAuthStatus} = useContext(authContext);
  const {login} = useContext(queryContext);
  const {dialog, setDialog} = useContext(rootContext);
  const [email, setEmail] = useState('zilliz');
  const [password, setPassword] = useState('123456');
  const classes = makeStyles(genTheme as any)() as any;
  const isIn = auth.userId !== 'guest';

  useEffect(() => {
    setTimeout(() => handleSubmit(), 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (isIn) {
    return <Redirect to="/" />;
    // return <Redirect to={`${PATH_BI}/:1`} />;
  }

  const handleSubmit = () => {
    if (email === '' || password === '') {
      setDialog({
        open: true,
        title: nls.label_wrong_happened,
        content: nls.tip_wrong_password,
        onConfirm: handleDialogClose,
      });
    } else {
      login({username: email, password}).then(
        (res: any) => {
          const {token, expired, connId} = res.data;
          setAuthStatus({userId: email, token, expired, connId});
        },
        () => {
          setDialog({
            open: true,
            title: nls.label_wrong_happened,
            content: nls.tip_wrong_password,
            onConfirm: handleDialogClose,
          });
        }
      );
    }
  };
  const handleDialogClose = () => {
    setEmail('');
    setPassword('');
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper classes={{root: classes.paper}}>
        <h1 className={classes.title}>{nls.label_title}</h1>
        <Divider className={classes.divider} />
        <div className={classes.info}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={nls.label_username}
            name="email"
            autoComplete="email"
            value={email}
            placeholder={nls.label_username_placeholder}
            onChange={e => {
              setEmail(e.target.value);
            }}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={nls.label_password}
            type="password"
            id="password"
            value={password}
            placeholder={nls.label_password_placeholder}
            onChange={e => {
              setPassword(e.target.value);
            }}
            autoComplete="current-password"
          />
          <Button
            className={classes.submit}
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            {nls.label_sign_in}
          </Button>
        </div>
      </Paper>
      <InfoDialog {...dialog} />
    </Container>
  );
};

export default Login;
