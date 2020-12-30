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
}) => {
  const { isMobile } = useDevice({ tablet: styles.tabletLandscapeLimit });

  const queryParams = useMemo(() => {
    const defaultQueryFilters = { q: '', filters: {} };
    if (location && location.search) {
      const { q, ...queryFilters } = querystring.parse(location.search);
      defaultQueryFilters.q = q;
      Object.entries(queryFilters).map(([key, options]) => {
        const filter = filters.find((filter) => filter.id === key);
        if (filter && filter.options && filter.options.length > 0) {
          defaultQueryFilters.filters[key] = [];
          options.split(',').map((id) => {
            const option = filter.options.find((option) => option.id === id);
            if (option && option.id && option.value) {
              defaultQueryFilters.filters[key].push(option);
            }
          });
        }
      });
      if (onSearch) {
        onSearch({
          input: defaultQueryFilters.q,
          filters: defaultQueryFilters.filters,
        });
      }
    }
    return defaultQueryFilters;
  }, [location]);

  const [searchInput, setSearchInput] = useState(() => queryParams.q);
  const [filterSelection, setFilterSelection] = useState(
    () => queryParams.filters
  );

  const handleInputChange = useCallback((event) => {
    setSearchInput(event.target.value);
  }, []);

  const setHistory = useCallback(() => {
    if (!filterSelection || Object.keys(filterSelection) === 0) return;

    const historyParams = searchInput ? { q: searchInput } : {};

    Object.entries(filterSelection).forEach(([key, options]) => {
      if (key && options && options.length > 0)
        historyParams[key] = options.map(({ id }) => id);
    });

    history.replaceState(
      historyParams,
      'Jobboard search',
      `?${new URLSearchParams(historyParams).toString()}`
    );
  }, [filterSelection, searchInput]);

  const handleSearch = useCallback(
    (event) => {
      if (event && event.key && event.key !== 'Enter') return;
      setHistory();
      if (onSearch) {
        onSearch({ input: searchInput, filters: filterSelection });
      }
    },
    [setHistory, searchInput, filterSelection]
  );

  const handleOnFilterChange = useCallback((selection, id) => {
    setFilterSelection((prev) => ({
      ...prev,
      [id]: selection,
    }));
  }, []);

  const renderFilters = useCallback(() => {
    return filters.map(({ id, name, options }) => (
      <Select
        defaultSelection={filterSelection[id]}
        key={id}
        onChange={(selection) => handleOnFilterChange(selection, id)}
        className={styles.filters__filter}
        pill
        multiselect
        confirmChoice
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
    ));
  }, [filters, filterSelection]);

  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    const anyFilters = Object.values(filterSelection).some(
      (filter) => filter && filter.length > 0
    );
    setEmpty(!searchInput && !anyFilters);
  }, [searchInput, filterSelection]);

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
          defaultValue="hello world"
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
      <Flexbox className={styles.filters}>{renderFilters()}</Flexbox>
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
        }
      `}
      render={(data) => <Search {...props} {...data.searchJson} />}
    />
  );
};

export default SearchWithQuery;
