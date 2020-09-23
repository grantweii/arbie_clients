import React, { FC } from 'react';
import { useRouteNode, useRouter, useRoute } from 'react-router5';
import { useQuery } from 'react-query';
import { getStocks, searchStocks, getStock } from './SearchActions';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';
import * as styles from './SearchStyles.scss';
import { IStock } from '../../common/utils/types';
import { Spinner } from '@chakra-ui/core';

const mapFilteredStocks = (stocks: IStock[]): SelectOption[] => {
    const mappedOptions = stocks?.map((stock: IStock) => {
        return { label: `${stock.ticker}, ${stock.name}, ${stock.exchange}`, value: stock.id }; 
    });
    return mappedOptions;
}

type SelectOption = {
    label: string;
    value: any;
}

const Search: FC<any> = ({ children }) => {
    const { route, router } = useRouteNode('root.stock');
    const { params } = route;

    const { data: stock, isLoading } = useQuery(['stocks', { id: params.id }], getStock, {
        staleTime: 60 * 1000 * 10,
        enabled: params.id
    });

    const loadOptions = (inputValue: string) => {
        return new Promise(async resolve => {
            const filteredStocks = await searchStocks(inputValue);
            const options = mapFilteredStocks(filteredStocks);
            resolve(options);
        });
    }
    const debouncedLoadOptions = debounce(loadOptions, 1000);

    const handleEntrySelected = (input: SelectOption) => {
        router.navigate('root.stock.id', { id: input.value }, { reload: true });
    }

    if (params.id && isLoading) return <Spinner/>

    return (
        <React.Fragment>
            <div className={styles.container}>
                <AsyncSelect
                    loadOptions={inputValue => debouncedLoadOptions(inputValue)}
                    cacheOptions
                    defaultOptions
                    defaultInputValue={params.id && `${stock?.ticker}, ${stock?.name}, ${stock?.exchange}`}
                    className={styles.inputContainer}
                    placeholder='Please provide a ticker'
                    styles={{ control: (provided) => ({ ...provided, cursor: 'text'}) }}
                    onChange={handleEntrySelected}
                />
            </div>
            {children}
        </React.Fragment>
    );
}

export default Search;