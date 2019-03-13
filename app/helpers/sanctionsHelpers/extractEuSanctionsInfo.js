/**
 * Created by vladtomsa on 2019-03-12
 */
const extractSanctionEntries = (entries, source) => {
    return entries.map(entry => {
        const {
            address,
            birthdate,
            identification,
            nameAlias,
            regulation,
            remark,
        } = entry;

        let firstName, lastName, birthDate, birthPlace, comment, idDocument, addressValue, sanctionType, includedInList;

        const aliases = [];

        nameAlias.forEach(alias => {
            aliases.push({
                aliasType: 'Name/Alias',
                value: alias.$.wholeName,
            });

            if (alias.$.firstName && !firstName) {
                firstName = alias.$.middleName ? `${alias.$.firstName} ${alias.$.middleName}` : alias.$.firstName;
            }

            if (alias.$.lastName && !lastName) {
                lastName = alias.$.lastName;
            }
        });

        if (birthdate) {
            const {
                dayOfMonth,
                monthOfYear,
                year,

                city,
                countryDescription, // UNKNOWN
                place,
                region,
                zipCode,
            } = birthdate[0].$;

            if (
                dayOfMonth
                || monthOfYear
                || year
            ) {
                birthDate = `${year || '????'}-${monthOfYear || '??'}-${dayOfMonth || '??'}`;
            }

            const birthPlaceInfo = [];

            if (place) birthPlaceInfo.push(place);

            if (region) birthPlaceInfo.push(region);

            if (city) birthPlaceInfo.push(city);

            if (zipCode) birthPlaceInfo.push(zipCode);

            if (countryDescription) birthPlaceInfo.push(countryDescription === 'UNKNOWN' ? 'Unknown country' : countryDescription);

            birthPlace = birthPlaceInfo.join(', ');
        }

        if (identification) {
            const idDocumentInfo = identification[0].$;

            const emittedByInfo = [];

            if (idDocumentInfo.issuedBy) emittedByInfo.push(idDocumentInfo.issuedBy);

            if (idDocumentInfo.countryDescription) emittedByInfo.push(idDocumentInfo.countryDescription);

            idDocument = {
                docType: idDocumentInfo.identificationTypeDescription,
                emittedBy: emittedByInfo.join(', '),
                idNo: idDocumentInfo.number,
            };
        }

        if (address) {
            addressValue = address
                .map((addressInfo, index) => {
                    const addressDetails = [];

                    const {
                        $: {
                            city,
                            countryDescription,
                            place,
                            region,
                            street,
                            zipCode,
                        },
                    } = addressInfo;

                    if (street) addressDetails.push(street);

                    if (city) addressDetails.push(city);

                    if (zipCode) addressDetails.push(zipCode);

                    if (place) addressDetails.push(place);

                    if (region) addressDetails.push(region);

                    if (countryDescription) addressDetails.push(countryDescription === 'UNKNOWN' ? 'Unknown country' : countryDescription);

                    return `Address ${index + 1}: ${addressDetails.join(', ')}`;
                })
                .join(', ');
        }

        if (remark) {
            comment = remark.join('; ');
        }

        if (regulation) {
            const {
                $: {
                    numberTitle,
                    regulationType,
                },
            } = regulation[0];

            sanctionType = regulationType;

            includedInList = `${regulationType} ${numberTitle}`;

        }

        return {
            firstName: firstName || '-',
            lastName: lastName  || '-',
            address: addressValue,
            idDocument,
            comment,
            birthDate,
            birthPlace,
            aliases,
            source,
            sanctionType,
            includedInList,
        };
    });
};
const extractEuSanctionsInfo = (entries, source) => {
    const sanctionEntries = extractSanctionEntries(entries, source);

    return {
        sanctionEntries,
    };
};

module.exports = {
    extractEuSanctionsInfo,
};