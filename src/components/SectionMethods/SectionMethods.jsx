import React, { useState, useEffect } from 'react';
import './SectionMethods.scoped.scss';

const coronavirusSearch =
  'https://www.ncbi.nlm.nih.gov/pmc/?term=%22coronavirus%22%5BMeSH+Terms%5D+OR+%22coronavirus%22%5BAll+Fields%5D+OR+%22COV%22%5BAll+Fields%5D';
const COVID19Search =
  'https://www.ncbi.nlm.nih.gov/pmc/?term=%22COVID-19%22%5BAll%20Fields%5D%20OR%20%22COVID-19%22%5BMeSH%20Terms%5D%20OR%20%22COVID-19%20Vaccines%22%5BAll%20Fields%5D%20OR%20%22COVID-19%20Vaccines%22%5BMeSH%20Terms%5D%20OR%20%22COVID-19%20serotherapy%22%5BAll%20Fields%5D%20OR%20%22COVID-19%20Nucleic%20Acid%20Testing%22%5BAll%20Fields%5D%20OR%20%22covid-19%20nucleic%20acid%20testing%22%5BMeSH%20Terms%5D%20OR%20%22COVID-19%20Serological%20Testing%22%5BAll%20Fields%5D%20OR%20%22covid-19%20serological%20testing%22%5BMeSH%20Terms%5D%20OR%20%22COVID-19%20Testing%22%5BAll%20Fields%5D%20OR%20%22covid-19%20testing%22%5BMeSH%20Terms%5D%20OR%20%22SARS-CoV-2%22%5BAll%20Fields%5D%20OR%20%22sars-cov-2%22%5BMeSH%20Terms%5D%20OR%20%22Severe%20Acute%20Respiratory%20Syndrome%20Coronavirus%202%22%5BAll%20Fields%5D%20OR%20%22NCOV%22%5BAll%20Fields%5D%20OR%20%222019%20NCOV%22%5BAll%20Fields%5D%20OR%20((%22coronavirus%22%5BMeSH%20Terms%5D%20OR%20%22coronavirus%22%5BAll%20Fields%5D%20OR%20%22COV%22%5BAll%20Fields%5D)%20AND%202019%2F11%2F01%5BPubDate%5D%20%3A%203000%2F12%2F31%5BPubDate%5D)';

const SectionMethods = (props) => {
  return (
    <section className={props.rootClassName}>
      <div className="methods-container">
        <h1>Methodology</h1>
        <div className="col-container">
          <div className="col">
            <p>
              The set of coronavirus and COVID-19 related research articles came
              from{' '}
              <a href="https://www.ncbi.nlm.nih.gov/pmc/" target="_blank">
                PubMed Central (PMC)
              </a>
              . The Coronavirus related articles per year were obtained by
              returning articles matching{' '}
              <a href={coronavirusSearch} target="_blank">
                these search terms
              </a>{' '}
              and filtering by publication date. Total PMC articles per year was
              estimated from The National Library of Medicine's{' '}
              <a
                href="https://www.ncbi.nlm.nih.gov/pmc/about/intro/"
                target="_blank"
              >
                PMC overview
              </a>
              . COVID-19 related articles were obtained by returning articles
              matching a{' '}
              <a href={COVID19Search} target="_blank">
                broader set of search terms
              </a>{' '}
              designed by PubMed Central to collect in one place relevant
              ongoing research throughout the pandemic.
            </p>
            <p>
              Metadata for each of the 2020 COVID-19 related articles, including
              title, journal name, authors, author affiliations, and publication
              date, was downloaded using PubMed APIs. Author affiliations were
              converted to addresses and geocoded at the resolution of cities
              using Google GeoCoding API.
            </p>
          </div>
          <div className="col">
            <p>
              {' '}
              Despite wide variation in how affiliations were reported, in
              random samples of the data, this approach correctly matched an
              affiliation string to the correct location in ~80% of cases, and
              the incorrect location in ~1% of cases. Affiliations without a
              corresponding geocoded location were removed from the dataset.
            </p>
            <p>
              The citation data were obtained using PubMed Citation APIs. For
              each article, we obtained 1) all of the articles cited by the
              current article, and 2) the number of subsequent articles that
              cite the current article. These citations came from the PubMed
              database, which is broader than PMC and includes closed access
              articles, and is thus more representative of the full set of
              citations on a given article.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionMethods;
