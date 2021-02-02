/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Typography,
  Section,
  Flexbox,
  Button,
  Select,
  Input,
  Icon,
  useDevice,
} from '@crocoder-dev/components';
import styles from './index.module.scss';
import QueryTitle from './QueryTitle';
import querystring from 'query-string';
import { StaticQuery, graphql } from 'gatsby';

const Search = ({
  title,
  subtitle,
  searchLabel,
  searchButtonText,
  filters,
  location,
  onSearch,
  className,
  hashtags,
  currentPage,
}) => {
  const maxInputLenght = 115;
  const { isMobile } = useDevice({ tablet: styles.tabletLandscapeLimit });

  const sortedHashtags = useMemo(() => {
    if (typeof hashtags === 'object' && Array.isArray(hashtags)) {
      return hashtags.map((tag) => tag.replace('#', '')).sort();
    }
  }, [hashtags]);

  const queryParams = useMemo(() => {
    const queryParams = {
      q: '',
      page: null,
      filters: {
        contract: [],
        experience: [],
        skills: [],
      },
    };

    if (location && location.search) {
      const {
        q = '',
        page = null,
        contract = '',
        experience = '',
        skills = '',
      } = querystring.parse(`${location.search}${location.hash}`);
      if (typeof contract === 'string') {
        queryParams.filters.contract = contract.split(',') || [];
      }
      if (typeof experience === 'string') {
        queryParams.filters.experience = experience.split(',') || [];
      }
      if (typeof skills === 'string') {
        queryParams.filters.skills = skills.split(',') || [];
      }
      if (typeof q === 'string') {
        queryParams.q = q.slice(0, maxInputLenght);
      }
      if (page && Number(page) > 0) {
        queryParams.page = page;
      }
    }

    return queryParams;
  }, [location]);

  const [empty, setEmpty] = useState(true);
  const [searchInput, setSearchInput] = useState(() => queryParams.q);
  const [filterSelection, setFilterSelection] = useState();

  const handleInputChange = useCallback((event) => {
    setSearchInput(event.target.value);
  }, []);

  const handleSearch = useCallback(
    (event) => {
      if (event && event.key && event.key !== 'Enter') return;
      if (onSearch) {
        onSearch({ input: searchInput, filters: filterSelection }, 1);
      }
    },
    [searchInput, filterSelection]
  );

  useEffect(() => {
    const historyParams = {};

    if (searchInput) {
      historyParams['q'] = searchInput;
    }

    if (currentPage) {
      historyParams['page'] = currentPage;
    }

    searchInput ? { q: searchInput } : {};

    if (filterSelection && Object.keys(filterSelection).length > 0) {
      Object.entries(filterSelection).forEach(([key, options]) => {
        if (key && options && options.length > 0) {
          historyParams[key] = options.map(({ id }) => id);
        }
      });
    }

    if (Object.keys(historyParams).length > 0) {
      const paramsEncoded = `?${new URLSearchParams(historyParams).toString()}`;
      const paramsDecoded = decodeURIComponent(paramsEncoded);
      history.replaceState(historyParams, 'Jobboard search', paramsDecoded);
    }
  }, [filterSelection, searchInput, currentPage]);

  const handleOnFilterChange = useCallback(
    (selection, id) => {
      setFilterSelection((prev) => ({
        ...prev,
        [id]: selection,
      }));
    },
    [filterSelection]
  );

  const renderFilters = useMemo(() => {
    return (
      <>
        {filters.map(({ id, name, options }) => (
          <Select
            defaultSelection={
              queryParams && queryParams.filters && queryParams.filters[id]
            }
            key={id}
            onChange={(selection) => handleOnFilterChange(selection, id)}
            className={styles.filters__filter}
            pill
            multiselect
            clear
            label={name}
            title={name}
          >
            {options.map(({ id, value }) => (
              <Select.Option key={id} id={id}>
                {value}
              </Select.Option>
            ))}
          </Select>
        ))}
        <Select
          defaultSelection={
            queryParams && queryParams.filters && queryParams.filters['skills']
          }
          key="skills"
          onChange={(selection) => handleOnFilterChange(selection, 'skills')}
          className={styles.filters__filter}
          pill
          multiselect
          clear
          label="Skills"
          title="Skills"
        >
          {sortedHashtags.map((tag) => (
            <Select.Option key={tag} id={tag}>
              {tag}
            </Select.Option>
          ))}
        </Select>
      </>
    );
  }, [filters, queryParams.filters]);

  useEffect(() => {
    const anyFilters = Object.values(filterSelection || {}).some(
      (filter) => filter && filter.length > 0
    );
    setEmpty(!searchInput && !anyFilters);
  }, [searchInput, filterSelection]);

  useEffect(() => {
    // Execute search if there is something in query params on first load

    if (
      Object.keys(queryParams.filters).length === 0 &&
      !queryParams.q &&
      !queryParams.page
    )
      return;

    const searchData = { input: queryParams.q, filters: {} };

    Object.entries(queryParams.filters).map(([filterId, options]) => {
      // Get only valid skills
      if (filterId === 'skills' && options && options.length > 0) {
        const existingSkills = options.filter((opt) => {
          return sortedHashtags.find((tag) => tag === opt);
        });
        if (existingSkills && existingSkills.length > 0) {
          searchData.filters['skills'] = existingSkills;
        }
      }
      // Get valid experiences and valid contract-types
      const filter = filters.find((f) => f.id === filterId);
      if (filter && filter.options) {
        const existingOptions = options.filter((option) =>
          filter.options.find((o) => o.id === option)
        );
        if (existingOptions && existingOptions.length > 0) {
          searchData.filters[filterId] = existingOptions;
        }
      }
    });
    if (onSearch) {
      onSearch(searchData, queryParams.page);
    }
  }, []);

  return (
    <Section className={`${styles.section} ${className}`}>
      <Typography
        className={styles.section__title}
        color="gray_2"
        fontFamily="rubik"
        fontSize={65}
        fontWeight={500}
        element="div"
      >
        {title}
        <Typography
          className={styles.section__subtitle}
          fontSize={36}
          fontFamily="rubik"
          element="div"
        >
          {subtitle}
        </Typography>
      </Typography>
      <Flexbox
        alignItems="center"
        className={styles.search}
        onKeyDownCapture={handleSearch}
      >
        <Input
          maxLength={maxInputLenght}
          defaultValue={queryParams.q || ''}
          className={styles.search__input}
          label={searchLabel}
          onChange={handleInputChange}
        />
        <Button className={styles.search__button} variant="sneaky">
          <Icon
            className={styles.search__button__icon}
            color="gray_2"
            icon="search1"
            fontSize={30}
          />
        </Button>
      </Flexbox>
      <Flexbox className={styles.filters}>{renderFilters}</Flexbox>
      <Flexbox alignItems="center" justifyContent="space-between">
        <QueryTitle
          empty={empty}
          filters={filterSelection}
          searchInput={searchInput}
        />
        <Button
          onClick={handleSearch}
          className={styles.searchButton}
          variant="secondary"
        >
          {isMobile || empty ? 'SEARCH' : searchButtonText}
        </Button>
      </Flexbox>
    </Section>
  );
};

const SearchWithQuery = (props) => {
  return (
    <StaticQuery
      query={graphql`
        query {
          searchJson {
            title
            subtitle
            searchLabel
            searchButtonText
            filters {
              id
              name
              options {
                id
                value
              }
            }
          }
          allMarkdownRemark {
            nodes {
              frontmatter {
                hashtags
              }
            }
          }
        }
      `}
      render={(data) => (
        <Search
          {...props}
          {...data.searchJson}
          hashtags={[
            ...new Set(
              data.allMarkdownRemark.nodes.flatMap((node) =>
                node.frontmatter.hashtags.split(',').splice(0, 3)
              )
            ),
          ]}
        />
      )}
    />
  );
};

export default SearchWithQuery;
