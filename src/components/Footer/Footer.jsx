import React, { useEffect, useState } from 'react';
import logo from './assets/wordmark.svg';

import './Footer.scoped.scss';

const fallbackData = [
  {
    image: '2018_02_stand-up',
    url: '2018/02/stand-up',
    hed: 'The Structure of Stand-Up Comedy'
  },
  {
    image: '2018_04_birthday-paradox',
    url: '2018/04/birthday-paradox',
    hed: 'The Birthday Paradox Experiment'
  },
  {
    image: '2018_11_boy-bands',
    url: '2018/11/boy-bands',
    hed: 'Internet Boy Band Database'
  },
  {
    image: '2018_08_pockets',
    url: '2018/08/pockets',
    hed: 'Women’s Pockets are Inferior'
  }
];

const Footer = () => {
  const [stories, setStories] = useState(fallbackData);
  const [storyLinks, setStoryLinks] = useState([]);
  useEffect(() => {
    // attempt to retrieve new stories
    const request = new XMLHttpRequest();
    const v = Date.now();
    const url = `https://pudding.cool/assets/data/stories.json?v=${v}`;
    request.open('GET', url, true);

    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const data = JSON.parse(request.responseText);
        setStories(data);
      }
    };
    request.send();
  }, []);

  useEffect(() => {
    // create links for each story
    const url = window.location.href;
    const html = stories
      .filter((d) => !url.includes(d.url))
      .slice(0, 4)
      .map((d, i) => {
        return (
          <div key={i} className="story-link">
            <a
              href={`https://pudding.cool/${d.url}`}
              target="_blank"
              rel="noopener"
            >
              <img
                className="story-link-image"
                src={`https://pudding.cool/common/assets/thumbnails/640/${d.image}.jpg`}
                alt={`${d.hed}`}
              ></img>
              <p className="story-link-headline">{`${d.hed}`}</p>
            </a>
          </div>
        );
      });
    setStoryLinks(html);
  }, [stories]);

  return (
    <footer className="pudding-footer">
      <div className="footer-content">
        <div className="footer-recirc">
          <div className="story-links-container">{storyLinks}</div>
        </div>

        <div className="footer-company">
          <div className="about-container">
            <img
              className="pudding-logo"
              alt="The Puddding Logo"
              src={logo}
            ></img>
            <p className="footer-company description">
              <a href="https://pudding.cool">The Pudding</a> is a digital
              publication that explains ideas debated in culture with visual
              essays.
            </p>
          </div>
        </div>

        <div className="links-container">
          <ul className="link-list">
            <li>
              <a href="https://facebook.com/pudding.viz/">
                <p>FACEBOOK</p>
              </a>
            </li>
            <li>
              <a href="https://twitter.com/puddingviz/">
                <p>TWITTER</p>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/the.pudding">
                <p>INSTAGRAM</p>
              </a>
            </li>
            <li>
              <a href="https://patreon.com/thepudding/">
                <p>PATREON</p>
              </a>
            </li>
            <li>
              <a href="https://pudding.cool/about">
                <p>ABOUT</p>
              </a>
            </li>
            <li>
              <a href="https://pudding.cool/privacy/">
                <p>PRIVACY</p>
              </a>
            </li>

            <li>
              <a href="http://eepurl.com/czym6f">
                <p>NEWSLETTER</p>
              </a>
            </li>

            <li>
              <a href="https://pudding.cool/feed/index.xml">
                <p>RSS</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
