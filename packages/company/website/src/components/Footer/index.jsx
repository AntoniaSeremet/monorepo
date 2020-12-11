import React from "react";
import { StaticQuery, graphql, Link } from "gatsby";
import CrocNav from '../../images/croc-nav.svg';
import { Icon, Footer as FooterComponent } from "@crocoder-dev/components";
import styles from "./index.module.scss";

const Footer = ({ socialMedia, sticky, scrollToTop }) => {
  return (
    <FooterComponent
      className={sticky ? styles.sticky : ""}
      logo={
        <Link to="/" onClick={
          () => {
            if(scrollToTop) scrollToTop();
          }
        }>
          <div className={styles.image}><CrocNav /></div>
        </Link>
      }
      socialLinks={
        <>
          {socialMedia.map((mediaLink) => (
            <a
              className={styles.icon}
              key={mediaLink.icon}
              href={mediaLink.link}
            >
              <Icon color="gray_1" icon={mediaLink.icon} />
            </a>
          ))}
        </>
      }
    >
      <Link to="/" style={{ color: "inherit" }} className="link">
        Home
      </Link>
      <Link to="/terms" style={{ color: "inherit" }} className="link">
        Terms of use
      </Link>
      <Link to="/privacy_policy" style={{ color: "inherit" }} className="link">
        Privacy policy
      </Link>
    </FooterComponent>
  );
};

const FooterWithQuery = ({ sticky, scrollToTop }) => (
  <StaticQuery
    query={graphql`
      query {
        homeJson {
          footer {
            socialMedia {
              link
              icon
            }
          }
        }
      }
    `}
    render={(data) => <Footer {...data.homeJson.footer} scrollToTop={scrollToTop} sticky={sticky} />}
  />
);

export default FooterWithQuery;
