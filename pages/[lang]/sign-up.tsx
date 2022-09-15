import React, { useContext } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import {
  Container,
  Typography,
  makeStyles,
  Theme,
  Button,
} from '@material-ui/core';
import { ContentfulContext } from '@pages/_app';
import PageContainer from '@src/components/layout/page-container';
import Link from '@src/components/link/link';
import { getLocaleConfig } from '@src/locales-map';
import getContentfulConfig from '@src/get-contentful-config';

let contentfulConfig = getContentfulConfig();

const logoRatio = contentfulConfig.icon.height / contentfulConfig.icon.width;

const useStyles = makeStyles((theme: Theme) => ({
  page: {
    backgroundColor: '#EAEAEA',
  },
  container: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '60.6rem',
    paddingBottom: theme.spacing(12),
    paddingTop: theme.spacing(8),
    '@media (max-height: 720px)': {
      paddingTop: theme.spacing(4),
    },
  },
  logo: {
    display: 'block',
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    '@media (max-height: 720px)': {
      maxWidth: `${Math.round(logoRatio * 40)}px`,
    },
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: '9px',
    boxShadow: '0 3px 6px #00000029',
    marginTop: theme.spacing(8),
    padding: theme.spacing(11, 14, 8),
    '@media (max-height: 720px)': {
      marginTop: theme.spacing(4),
    },
  },
  formFields: {
    marginTop: theme.spacing(5),
  },
  formField: {
    '& + &': {
      marginTop: theme.spacing(5),
    },
  },
  formFieldLabel: {
    color: '#797979',
    display: 'flex',
    fontSize: '1.8rem',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  input: {
    appearance: 'none',
    backgroundColor: '#fff',
    border: '1px solid #797979',
    borderRadius: '9px',
    boxShadow: 'none',
    fontSize: '2.1rem',
    height: '5.4rem',
    padding: theme.spacing(2, 3),
    width: '100%',
  },
  forgotPassword: {
    color: '#797979',
  },
  signUp: {
    width: '100%',
  },
  signUpText: {
    marginTop: theme.spacing(4),
    textAlign: 'center',
  },
  signIn: {
    color: '#000',
  },
}));

const SignUpPage: NextPage = () => {
  const { defaultLocale, locale } = useContext(ContentfulContext);
  const { lang, locale: realLocale } = getLocaleConfig(locale || defaultLocale);
  const classes = useStyles();

  contentfulConfig = getContentfulConfig(realLocale);

  return (
    <>
      <Head>
        <title key="title">Sign Up</title>
        <meta key="og:title" property="og:title" content="Sign Up" />
        <meta
          key="description"
          name="description"
          content={contentfulConfig.meta.description}
        />
        <meta
          key="og:description"
          property="og:description"
          content={contentfulConfig.meta.description}
        />
        <meta
          key="og:url"
          property="og:url"
          content={`${contentfulConfig.meta.url}/${lang}/sign-up`}
        />
        <meta
          key="og:locale"
          property="og:locale"
          content={locale.replace('-', '_')}
        />
      </Head>
      <PageContainer className={classes.page}>
        <Container maxWidth={false}>
          <section className={classes.container}>
            <header>
              <img
                src={contentfulConfig.icon.dark}
                className={classes.logo}
                alt="Logo"
                width={contentfulConfig.icon.width}
                height={contentfulConfig.icon.height}
              />
            </header>
            <form className={classes.form}>
              <Typography variant="h3" component="h1">
                {realLocale === 'de-DE'
                  ? 'Erstellen Sie Ihr GoCoin-Konto'
                  : 'Create your GoCoin account'}
              </Typography>
              <div className={classes.formFields}>
                <div className={classes.formField}>
                  <div className={classes.formFieldLabel}>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="sign-up-name">Name</label>
                  </div>
                  <input
                    id="sign-up-name"
                    name="name"
                    type="text"
                    className={classes.input}
                  />
                </div>
                <div className={classes.formField}>
                  <div className={classes.formFieldLabel}>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="sign-up-email">E-Mail</label>
                  </div>
                  <input
                    id="sign-up-email"
                    name="email"
                    type="email"
                    className={classes.input}
                  />
                </div>
                <div className={classes.formField}>
                  <div className={classes.formFieldLabel}>
                    <label htmlFor="sign-up-password">
                      {realLocale === 'de-DE' ? 'Kennwort' : 'Password'}
                    </label>
                  </div>
                  <input
                    id="sign-up-password"
                    name="password"
                    type="password"
                    className={classes.input}
                  />
                </div>
                <div className={classes.formField}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.signUp}
                  >
                    {realLocale === 'de-DE' ? 'Anmelden' : 'Sign Up'}
                  </Button>
                  <Typography className={classes.signUpText}>
                    {realLocale === 'de-DE'
                      ? 'Haben Sie bereits ein Konto?'
                      : 'Already have an account?'}{' '}
                    <Link
                      href="/[lang]/sign-in"
                      as={`/${lang}/sign-in`}
                      variant="text"
                      color="primary"
                      underline
                      className={classes.signIn}
                    >
                      {realLocale === 'de-DE' ? 'Einloggen' : 'Sign In'}
                    </Link>
                  </Typography>
                </div>
              </div>
            </form>
          </section>
        </Container>
      </PageContainer>
    </>
  );
};

export default SignUpPage;