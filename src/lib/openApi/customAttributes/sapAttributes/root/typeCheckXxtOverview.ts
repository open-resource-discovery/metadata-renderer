export type ExtOverviewProps = {
    xSapExtOverview: {
        name: string;
        values: string | (string | { text: string; format: 'plain' | 'markdown' })[];
    }[];
};

export function typeCheckExSapExtOverviewExSapExtOverview(obj: unknown): obj is ExtOverviewProps {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    if (!('xSapExtOverview' in obj) || !Array.isArray(obj.xSapExtOverview)) {
        return false;
    }
    return obj.xSapExtOverview.every((xSapExtOverview: unknown) => {
        if (typeof xSapExtOverview !== 'object' || xSapExtOverview === null) {
            return false;
        }
        if (!('name' in xSapExtOverview) || !('values' in xSapExtOverview)) {
            return false;
        }
        if (typeof xSapExtOverview.name !== 'string') {
            return false;
        }
        if (typeof xSapExtOverview.values === 'string') {
            return true;
        }
        if (!Array.isArray(xSapExtOverview.values)) {
            return false;
        }
        if (xSapExtOverview.values.every((value: unknown) => typeof value === 'string')) {
            return true;
        }
        return xSapExtOverview.values.every((value: unknown) => {
            if (typeof value !== 'object' || value === null) {
                return false;
            }
            if (!('text' in value) || typeof value.text !== 'string') {
                return false;
            }
            return 'format' in value && (value.format === 'plain' || value.format === 'markdown');
        });
    });
}
