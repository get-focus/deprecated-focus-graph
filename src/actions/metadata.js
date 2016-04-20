export const LOAD_DEFINITIONS = 'LOAD_DEFINITIONS';
export const LOAD_DOMAINS = 'LOAD_DOMAINS';

export const loadDefinitions = definitions => ({
    type: LOAD_DEFINITIONS,
    definitions
});

export const loadDomains = domains => ({
    type: LOAD_DOMAINS,
    domains
});
