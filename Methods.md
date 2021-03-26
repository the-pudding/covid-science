# Methods

## Web-site data pipeline

The site design requires a set of specialized (and compressed) datasets. These datasets often are based on the main data processing pipelines described in more detail here https://github.com/jeffmacinnes/COVID_vis

These steps can be thought of as a final stage polishing to organize the data in a way best suited to the site.

### General

The main dataset for this project is the set of COVID-related open access articles published on PubMed Central:

https://www.ncbi.nlm.nih.gov/pmc/?term=%22COVID-19%22%5BAll%20Fields%5D%20OR%20%22COVID-19%22%5BMeSH%20Terms%5D%20OR%20%22COVID-19%20Vaccines%22%5BAll%20Fields%5D%20OR%20%22COVID-19%20Vaccines%22%5BMeSH%20Terms%5D%20OR%20%22COVID-19%20serotherapy%22%5BAll%20Fields%5D%20OR%20%22COVID-19%20Nucleic%20Acid%20Testing%22%5BAll%20Fields%5D%20OR%20%22covid-19%20nucleic%20acid%20testing%22%5BMeSH%20Terms%5D%20OR%20%22COVID-19%20Serological%20Testing%22%5BAll%20Fields%5D%20OR%20%22covid-19%20serological%20testing%22%5BMeSH%20Terms%5D%20OR%20%22COVID-19%20Testing%22%5BAll%20Fields%5D%20OR%20%22covid-19%20testing%22%5BMeSH%20Terms%5D%20OR%20%22SARS-CoV-2%22%5BAll%20Fields%5D%20OR%20%22sars-cov-2%22%5BMeSH%20Terms%5D%20OR%20%22Severe%20Acute%20Respiratory%20Syndrome%20Coronavirus%202%22%5BAll%20Fields%5D%20OR%20%22NCOV%22%5BAll%20Fields%5D%20OR%20%222019%20NCOV%22%5BAll%20Fields%5D%20OR%20((%22coronavirus%22%5BMeSH%20Terms%5D%20OR%20%22coronavirus%22%5BAll%20Fields%5D%20OR%20%22COV%22%5BAll%20Fields%5D)%20AND%202019%2F11%2F01%5BPubDate%5D%20%3A%203000%2F12%2F31%5BPubDate%5D)

This dataset resulted from the search string:

```
"COVID-19"[All Fields] OR "COVID-19"[MeSH Terms] OR "COVID-19 Vaccines"[All Fields] OR "COVID-19 Vaccines"[MeSH Terms] OR "COVID-19 serotherapy"[All Fields] OR "COVID-19 Nucleic Acid Testing"[All Fields] OR "covid-19 nucleic acid testing"[MeSH Terms] OR "COVID-19 Serological Testing"[All Fields] OR "covid-19 serological testing"[MeSH Terms] OR "COVID-19 Testing"[All Fields] OR "covid-19 testing"[MeSH Terms] OR "SARS-CoV-2"[All Fields] OR "sars-cov-2"[MeSH Terms] OR "Severe Acute Respiratory Syndrome Coronavirus 2"[All Fields] OR "NCOV"[All Fields] OR "2019 NCOV"[All Fields] OR (("coronavirus"[MeSH Terms] OR "coronavirus"[All Fields] OR "COV"[All Fields]) AND 2019/11/01[PubDate] : 3000/12/31[PubDate])
```

### Hero Data

The list of titles used to generate the hero datavis was obtained by taking a random sample of 1000 titles from the full articles database `data/articleMetadata.json`

### Section 1 - 2020 Articles Overview

#### papers per year plot:

The `papersPerYear.csv` was obtained by going to **pubmed central** and using the search string `"coronavirus"[MeSH Terms] OR "coronavirus"[All Fields] OR "COV"[All Fields]` and then applying a custom filter (using the left hand panel) to define a date range. I did this for every year from 1980-onwards.

_NOTE:_ I used this shortened search string -- looking for `coronavirus` related papers only -- instead of the larger search string used for the full set of 2020 papers because the larger search string would artificially inflate the number of papers in 2020 compared to prior years. That larger search string includes things like "COVID-19" which obviously wasn't around prior to 2019. This ensures a fairer representation in the papers-per-year plot, but necessitates a little more explanation about how the larger 2020 dataset is different.

_NOTE:_ For the sake of completeness, I ran the same query by year at **PubMed** (instead of PMC). These data are included as a separate column in the `papersPerYear.csv` table (the pattern is largely the same).

#### 2020 article stats:

- _93,593 articles in 2020_: the number of **VALID** PMCIDs returned using the search string above on **pubmed central** and filtering to restrict to 2020 only. There were 96,625 articles total, but was unable to scrap ~3k for some reason or another.
- _203 countries_: Number of unique countries found in geocoded article metadata for the set of 93,593 articles above
- _11 articles per hour_: 93,593 articles / 366 days (leap year) / 24 hours
- _6799 journals_: Number of unique journals found in article metadata for the set of 93,593 articles above

- _comparisons against all other papers in PMC_ (for context)
  - from this site https://www.ncbi.nlm.nih.gov/pmc/about/intro/ we can calculate the number of new articles added to PMC each fiscal year (Oct-Sep). There were **745,357** articles added in 2020; **618,229** in 2019. Given that these are fiscal years, not calendar years, these stats should be talked about as approximations
  - In 2020, there were 79,433 "coronavirus" articles (from `papersPerYear.csv`), or 10.6% of the 745,357 2020 papers. ~1 out of every 10 papers.
  - In 2019, there were 4,782 "coronavirus" articles, or 0.77% of the 618,229 articles. ~1 out of every 130 articles.

### Section II - Collaboration Map

The data for the collaboration map was prepared for the web using the collaboration data collected and geocoded via the pipeline described in detail here: https://github.com/jeffmacinnes/COVID_vis

The set of collaborations and geoIDs datasets were stripped of superflous data fields and compressed to make as small as possible for the web.

The total number of authors by day was calculated by summing the number of authors on each article from Jan 1st 2020 to the current date.

The total collaborations by day was calculated by summing the number of collaborations per article for each article from Jan 1st 2020 to the current date. The number of unique pairwise collaborations between authors was calculated as: `nAuths * (nAuths-1) / 2`

### Section III - Citation Graph

The citation network plot data was obtained using the Pubmed citation database, accessed via the APIs here: https://www.ncbi.nlm.nih.gov/pmc/tools/cites-citedby/

This data is accurate as of March 2nd 2021.

The data for each stage of the plot:

- We pulled the PMIDs of every article that was cited by the Moderna and Pfizer vaccine safety and efficacy papers published in Dec 2020. These are 1st deg citations.

- For each of those articles, we next pulled the PMIDs of every article cited within the 1st deg citation. These are 2nd deg citations.

- For the full set of articles (vax articles, 1st deg citations, 2nd deg citations), we used the cited-by API to get the number of subsequent articles that cited each article.
