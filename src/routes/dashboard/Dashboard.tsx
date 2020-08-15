import React, { FC } from 'react';
import { useRouteNode, useRouter, useRoute } from 'react-router5';
import { useQuery } from 'react-query';
import { getStocks, searchStocks, IStock } from './DashboardActions';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';
import * as styles from './DashboardStyles.scss';

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

const Dashboard: FC<any> = ({ children }) => {
    const { route, router } = useRouteNode('dashboard');
    const { data: allStocks } = useQuery(['stocks'], getStocks, { staleTime: 60 * 1000 * 10 });

    const loadOptions = (inputValue: string) => {
        return new Promise(async resolve => {
            const filteredStocks = await searchStocks(inputValue);
            const options = mapFilteredStocks(filteredStocks);
            resolve(options);
        });
    }
    const debouncedLoadOptions = debounce(loadOptions, 1000);

    const handleEntrySelected = (input: SelectOption) => {
        router.navigate('stock.id', { id: input.value }, { reload: true });
        // UP TO HERE TESTING IF THIS ACTUALLY WORKS
    }

    return (
        <React.Fragment>
            <div className={styles.container}>
                <AsyncSelect
                    loadOptions={inputValue => debouncedLoadOptions(inputValue)}
                    cacheOptions
                    defaultOptions
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

export default Dashboard;