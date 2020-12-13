import React from 'React';
import { Heading, Stack, Spinner, Box } from '@chakra-ui/core';
import Select from 'react-select';
import { Hidden } from '../../common/components/Hidden';


const StandardFilters = () => {
    

    return (
        <React.Fragment>
            <Heading as='h3' size='lg' marginBottom={4}>Filters</Heading>
            <Stack spacing={8} isInline>
                <Stack spacing={2}>
                    <Heading as='h5' size="sm">Exchange</Heading>
                    <Select
                        value={filteredExchange && { value: filteredExchange, label: filteredExchange }}
                        onChange={(selected: any) => {
                            setFilteredExchange(selected?.value);
                            setPageIndex(0);
                        }}
                        options={exchangeOptions}
                        placeholder='Exchange'
                        className={styles.select}
                        isClearable
                    />
                </Stack>
                <Stack spacing={2}>
                    <Heading as='h5' size="sm">Industry</Heading>
                    <Select
                        value={filteredIndustry && { value: filteredIndustry, label: filteredIndustry }}
                        onChange={(selected: any) => {
                            setFilteredIndustry(selected?.value);
                            setPageIndex(0);
                        }}
                        options={industryOptions}
                        placeholder='Industry'
                        className={styles.select}
                        isClearable
                    />
                </Stack>
                <Stack spacing={2}>
                    <Heading as='h5' size="sm">Sector</Heading>
                    <Select
                        value={filteredSector && { value: filteredSector, label: filteredSector }}
                        onChange={(selected: any) => {
                            setFilteredSector(selected?.value);
                            setPageIndex(0);
                        }}
                        options={sectorOptions}
                        placeholder='Sector'
                        className={styles.select}
                        isClearable
                    />
                </Stack>
            </Stack>
        </React.Fragment>
    )
}

export default StandardFilters