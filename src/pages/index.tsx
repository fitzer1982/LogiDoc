import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
      </div>
    </header>
  );
}

function SDKGrid() {
  const sdks = [
    {
      title: 'Logitech Actions SDK',
      description: 'Create custom actions and integrations for Logitech gaming peripherals.',
      link: '/docs/actions-sdk/',
      className: 'actions-sdk',
      image: '/LogiDoc/img/mx-creative-console.gif'
    },
    {
      title: 'LightSync SDK',
      description: 'Control RGB lighting effects and synchronization across Logitech devices.',
      link: '/docs/lightsync-sdk/intro',
      className: 'lightsync-sdk',
      image: '/LogiDoc/img/g-hub-article-lightsync-rgb-hero-desktop.webp'
    },
    {
      title: 'TrueForce SDK',
      description: 'Access advanced force feedback and haptic technology.',
      link: '/docs/gamepanel/intro',
      className: 'trueforce-sdk',
      video: '/LogiDoc/img/gaming-trueforce-hero-desktop.mp4'
    },
    {
      title: 'Haptics G',
      description: 'Implement haptic feedback and tactile responses in your applications.',
      link: '/docs/led-illumination/intro',
      className: 'haptics-sdk',
      image: '/LogiDoc/img/cover-6.jpg'
    },
    {
      title: 'Video SDK',
      description: 'Integrate with Logitech webcams and video streaming devices.',
      link: '/docs/video-sdk/intro',
      className: 'video-sdk',
      image: '/LogiDoc/img/images.jpg'
    },
    {
      title: 'Blue Voice SDK',
      description: 'Access professional voice processing and audio enhancement features.',
      link: '/docs/blue-voice-sdk/intro',
      className: 'blue-voice-sdk',
      image: '/LogiDoc/img/download.jpg'
    }
  ];

  return (
    <section className="sdk-intro">
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <Heading as="h2" className="text--center margin-bottom--lg">
              Choose Your SDK
            </Heading>
          </div>
        </div>
        <div className="row">
          {sdks.map((sdk, idx) => (
            <div key={idx} className="col col--4 margin-bottom--lg">
              <div className={clsx('card', sdk.className)}>
                {sdk.image && (
                  <div className="card__image">
                    <img
                      src={sdk.image}
                      alt={sdk.title}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px 8px 0 0'
                      }}
                    />
                  </div>
                )}
                {sdk.video && (
                  <div className="card__image">
                    <video
                      src={sdk.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px 8px 0 0'
                      }}
                    />
                  </div>
                )}
                <div className="card__header">
                  <Heading as="h3">{sdk.title}</Heading>
                </div>
                <div className="card__body">
                  <p>{sdk.description}</p>
                </div>
                <div className="card__footer">
                  <Link
                    className="button button--primary button--block"
                    to={sdk.link}>
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Official documentation for Logitech gaming SDKs and developer tools">
      <HomepageHeader />
      <main>
        <SDKGrid />
      </main>
    </Layout>
  );
}
