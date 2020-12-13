import { useState, useMemo, useEffect } from 'react';
import { useQuery } from 'react-query';
import { actions } from 'react-table';
import { getIndustries, getSectors, getExchanges, getStockList, GetStockListResponse } from './DiscoverActions';


type DiscoverViewModel = {
    filteredIndustry: string,
    filteredSector: string,
    filteredExchange: string,
    industryOptions: { label: string, value: string }[],
    sectorOptions: { label: string, value: string }[],
    exchangeOptions: { label: string, value: string }[],
    loadingList: boolean,
    setFilteredIndustry: (industry: string) => void,
    setFilteredSector: (sector: string) => void,
    setFilteredExchange: (exchange: string) => void,
    setErrorVisibility: (visible: boolean) => void;
    errorVisible: boolean;
    stockList: GetStockListResponse;
    pageSize: number;
    pageIndex: number;
    setPageSize: (size: number) => void; 
    setPageIndex: (index: number) => void;
}

const mapOptions = (data: string[]) => {
    return data?.map((option: string) => {
        return {
            label: option,
            value: option,
        }
    });
} 


function useDiscoverViewModel(): DiscoverViewModel {
    // industry needs to be a distinct retrieved from server
    // sector needs to be a distinct retrieved from server
    // exchange can just be defined here
    const [filteredIndustry, setFilteredIndustry] = useState(null);
    const [filteredSector, setFilteredSector] = useState(null);
    const [filteredExchange, setFilteredExchange] = useState(null);
    const [errorVisible, setErrorVisibility] = useState(false);
    const [pageSize, setPageSize] = useState(50);
    const [pageIndex, setPageIndex] = useState(0);

    const { data: industries } = useQuery(['industries', { sector: filteredSector }], getIndustries, { staleTime: 60 * 1000 * 10 });
    const { data: sectors } = useQuery(['sectors', { industry: filteredIndustry }], getSectors, { staleTime: 60 * 1000 * 10 });
    const { data: exchanges } = useQuery(['exchanges'], getExchanges, { staleTime: 60 * 1000 * 10 });
    const { data: stockList, isLoading, isFetching } = useQuery(
        ['stockList', { industry: filteredIndustry, sector: filteredSector, exchange: filteredExchange, pageSize, pageIndex }],
        getStockList, { staleTime: 60 * 1000 * 10, enabled: filteredIndustry || filteredSector },
    );

    const loadingList = isLoading || isFetching;

    const industryOptions = useMemo(() => mapOptions(industries), [industries?.length]);
    const sectorOptions = useMemo(() => mapOptions(sectors), [sectors?.length]);
    const exchangeOptions = useMemo(() => mapOptions(exchanges), [exchanges?.length]);

    return {
        filteredIndustry,
        filteredExchange,
        filteredSector,
        industryOptions,
        sectorOptions,
        exchangeOptions,
        loadingList,
        errorVisible,
        stockList,
        pageSize,
        pageIndex,
        setFilteredIndustry,
        setFilteredSector,
        setFilteredExchange,
        setErrorVisibility,
        setPageSize,
        setPageIndex,
    }
}

export default useDiscoverViewModel;