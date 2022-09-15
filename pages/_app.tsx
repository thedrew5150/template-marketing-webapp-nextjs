import React, { useEffect } from 'react';
import Head from 'next/head';
import App, { AppContext, AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/styles';
import Layout from '@src/components/layout/layout';
import colorfulTheme from '@src/theme';
import { config as fontawesomeConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import getContentfulConfig from '@src/get-contentful-config';
import { getLocaleConfig } from '@src/locales-map';
import '@src/components/layout/layout.css';
import { NinetailedProvider } from '@ninetailed/experience.js-next';
import { NinetailedGoogleAnalyticsPlugin } from '@ninetailed/experience.js-plugin-google-analytics';
import { NinetailedPreviewPlugin } from '@ninetailed/experience.js-plugin-preview';

import Settings from '@src/components/settings/settings';

const contentfulConfig = getContentfulConfig();

fontawesomeConfig.autoAddCss = false;

interface ContentfulContextInterface {
  locale: string;
  defaultLocale: string;
  spaceIds: {
    main: string;
    legal: string;
  };
  previewActive: boolean;
  xrayActive: boolean;
  appUrl: string;
  spaceEnv: string;
  availableLocales: string[];
  personalizationAudience: string | null;
}

const contentfulContextValue: ContentfulContextInterface = {
  locale: contentfulConfig.contentful.default_locale,
  defaultLocale: contentfulConfig.contentful.default_locale,
  spaceIds: {
    main: contentfulConfig.contentful.main_space_id,
    legal: contentfulConfig.contentful.legal_space_id,
  },
  previewActive: false,
  xrayActive: false,
  appUrl: contentfulConfig.meta.url,
  spaceEnv: 'default',
  availableLocales: contentfulConfig.contentful.available_locales,
  personalizationAudience: null,
};

export const ContentfulContext = React.createContext(contentfulContextValue);

const CustomApp = (
  props: AppProps & {
    ninetailed: {
      profile: any;
      preview: {
        audiences: string[];
      };
    };
  },
) => {
  const { Component, pageProps, router, ninetailed } = props;

  useEffect(() => {
    // when component is mounting we remove server side rendered css:
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    const onRouteChange = (url: string) => {
      // Google analytics
      if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
        try {
          window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
            page_location: url,
          });
        } catch (error) {
          console.warn('could not "gtag"');
        }
      }
    };

    router.events.on('routeChangeComplete', onRouteChange);

    return () => {
      router.events.off('routeChangeComplete', onRouteChange);
    };
  }, []);

  contentfulContextValue.locale = getLocaleConfig(
    (router.query.lang as string) || contentfulConfig.contentful.default_locale,
  ).locale;
  contentfulContextValue.previewActive = !!router.query.preview;
  contentfulContextValue.xrayActive = !!router.query.xray;

  if (router.query.env !== undefined) {
    contentfulContextValue.spaceEnv = router.query.env as string;
  } else {
    contentfulContextValue.spaceEnv = 'default';
  }

  contentfulContextValue.personalizationAudience =
    (router.query.personalizationAudience as string) || null;

  return (
    <ContentfulContext.Provider value={contentfulContextValue}>
      {/* TODO: comment back in or out, depending on the fate of Ninetailed. For now it's commented out to run the local development environment */}
      {/*<NinetailedProvider*/}
      {/*  clientId={process.env.NEXT_PUBLIC_NINETAILED_API_KEY ?? ''}*/}
      {/*  environment={process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT}*/}
      {/*  plugins={[*/}
      {/*    NinetailedGoogleAnalyticsPlugin({*/}
      {/*      trackingId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? '',*/}
      {/*      actionTemplate: 'Seen Component - Audience:{{ audience.name }}',*/}
      {/*      labelTemplate:*/}
      {/*        '{{ baselineOrVariant }}:{{ component.__typename }} - {{ component.internalName }}',*/}
      {/*    }),*/}
      {/*    NinetailedPreviewPlugin({*/}
      {/*      clientId: '4cbb065e-d983-4a0b-9949-7eb4fce9dd7b',*/}
      {/*      secret: '35f3fd2c-b564-4aff-8240-677636bf110a',*/}
      {/*      environment: process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT,*/}
      {/*      ui: {*/}
      {/*        opener: {*/}
      {/*          hide: true,*/}
      {/*        },*/}
      {/*      },*/}
      {/*    }),*/}
      {/*  ]}*/}
      {/*  // profile={ninetailed.profile}*/}
      {/*>*/}
      <ThemeProvider theme={colorfulTheme}>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          <title key="title">{contentfulConfig.meta.title}</title>
          <meta
            key="og:title"
            property="og:title"
            content={contentfulConfig.meta.title}
          />
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
            key="og:image"
            property="og:image"
            content={contentfulConfig.meta.image}
          />
          <meta key="og:image:width" property="og:image:width" content="1200" />
          <meta
            key="og:image:height"
            property="og:image:height"
            content="630"
          />
          <meta key="og:type" property="og:type" content="website" />
        </Head>
        <Layout
          locale={contentfulContextValue.locale}
          preview={contentfulContextValue.previewActive}
        >
          <Component {...pageProps} err={(props as any).err} />
          <Settings />
        </Layout>
      </ThemeProvider>
      {/*</NinetailedProvider>*/}
    </ContentfulContext.Provider>
  );
};

CustomApp.getInitialProps = async (appContext: AppContext) => {
  const pageProps = await App.getInitialProps(appContext);

  // const profile =
  //   typeof window === 'undefined'
  //     ? await getServerSideProfile(
  //         appContext.ctx as unknown as GetServerSidePropsContext,
  //         {
  //           apiKey: process.env.NEXT_PUBLIC_NINETAILED_API_KEY ?? '',
  //         },
  //       )
  //     : undefined;

  const previewAudiences = appContext.ctx.query.nt_preview_audience
    ? [appContext.ctx.query.nt_preview_audience]
    : [];

  return {
    ...pageProps,
    // ninetailed: { profile, preview: { audiences: previewAudiences.flat() } },
  };
};

export default CustomApp;
