/**
 * Created by vladtomsa on 2019-02-19
 */
const VALID_ATTRIBUTE_TYPES = {
    'Birthdate': 'birthDate',
    'Place of Birth': 'birthPlace',
    'Location': 'address',
    'Phone Number': 'phoneNumber',
    'Email Address': 'email'
};

const isIterable = (obj) => {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
};

const setDateOfIssue = (dateOfIssue) => {
    const [date] = dateOfIssue;
    const {Day, Month, Year} = date;
    const [day] = Day;
    const [month] = Month;
    const [year] = Year;

    return `${year}-${month}-${day}`;
};

const extractReferenceValuesSets = (ReferenceValueSets) => {
    const {
        AliasTypeValues: [
            {AliasType},
        ],
        AreaCodeValues: [
            {AreaCode},
        ],
        AreaCodeTypeValues: [
            {AreaCodeType},
        ],
        CalendarTypeValues: [
            {CalendarType},
        ],
        CountryValues: [
            {Country}
        ],
        CountryRelevanceValues: [
            {CountryRelevance},
        ],
        DecisionMakingBodyValues: [
            {DecisionMakingBody},
        ],
        DetailReferenceValues: [
            {DetailReference},
        ],
        DetailTypeValues: [
            {DetailType},
        ],
        DocNameStatusValues: [
            {DocNameStatus},
        ],
        EntryEventTypeValues: [
            {EntryEventType},
        ],
        EntryLinkTypeValues: [
            {EntryLinkType},
        ],
        ExRefTypeValues: [
            {ExRefType},
        ],
        FeatureTypeValues: [
            {FeatureType},
        ],
        FeatureTypeGroupValues: [
            {FeatureTypeGroup},
        ],
        IDRegDocDateTypeValues: [
            {IDRegDocDateType},
        ],
        IDRegDocTypeValues: [
            {IDRegDocType},
        ],
        IdentityFeatureLinkTypeValues: [
            {IdentityFeatureLinkType},
        ],
        LegalBasisValues: [
            {LegalBasis},
        ],
        LegalBasisTypeValues: [
            {LegalBasisType},
        ],
        ListValues: [
            {List},
        ],
        LocPartTypeValues: [
            {LocPartType},
        ],
        LocPartValueStatusValues: [
            {LocPartValueStatus},
        ],
        LocPartValueTypeValues: [
            {LocPartValueType},
        ],
        NamePartTypeValues: [
            {NamePartType},
        ],
        OrganisationValues: [
            {Organisation},
        ],
        PartySubTypeValues: [
            {PartySubType},
        ],
        PartyTypeValues: [
            {PartyType},
        ],
        RelationQualityValues: [
            {RelationQuality},
        ],
        RelationTypeValues: [
            {RelationType},
        ],
        ReliabilityValues: [
            {Reliability},
        ],
        SanctionsProgramValues: [
            {SanctionsProgram},
        ],
        SanctionsTypeValues: [
            {SanctionsType},
        ],
        ScriptValues: [
            {Script},
        ],
        ScriptStatusValues: [
            {ScriptStatus},
        ],
        SubsidiaryBodyValues: [
            {SubsidiaryBody},
        ],
        SupInfoTypeValues: [
            {SupInfoType},
        ],
        TargetTypeValues: [
            {TargetType},
        ],
        ValidityValues: [
            {Validity},
        ],
    } = ReferenceValueSets[0];

    const aliasTypes = {};
    const areaCodeTypes = {};
    const areaCodes = {};
    const calendarTypes = {};
    const countryRelevances = {};
    const countries = {};
    const decisionMakingBodies = {};
    const detailReferences = {};
    const detailTypes = {};
    const docNameStatuses = {};
    const entryEventTypes = {};
    const entryLinkTypes = {};
    const exRefTypes = {};
    const featureTypes = {};
    const featureTypeGroups = {};
    const idRegDocDateTypes = {};
    const idRegDocTypes = {};
    const identityFeatureLinkTypes = {};
    const legalBasisis = {};
    const legalBasisTypes = {};
    const lists = {};
    const locPartTypes = {};
    const locPartValueStatuses = {};
    const locPartValueTypes = {};
    const namePartTypes = {};
    const organisations = {};
    const partySubTypes = {};
    const partyTypes = {};
    const relationQualities = {};
    const relationTypes = {};
    const reliabilities = {};
    const sanctionsPrograms = {};
    const sanctionsTypes = {};
    const scripts = {};
    const scriptStatuses = {};
    const subsidiaryBodies = {};
    const supInfoTypes = {};
    const targetTypes = {};
    const validities = {};

    if (isIterable(AliasType)) {
        AliasType.forEach(alias => {
            const {$: {ID}, _} = alias;

            aliasTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(AreaCodeType)) {
        AreaCodeType.forEach(areaCodeType => {
            const {$: {ID}, _} = areaCodeType;

            areaCodeTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(CalendarType)) {
        CalendarType.forEach(calendarType => {
            const {$: {ID}, _} = calendarType;

            calendarTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(CountryRelevance)) {
        CountryRelevance.forEach(countryRelevance => {
            const {$: {ID}, _} = countryRelevance;

            countryRelevances[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(Country)) {
        Country.forEach(country => {
            const {$: {ID, ISO2}, _} = country;

            countries[ID] = {
                id: ID,
                value: _,
                iso2: ISO2,
            }
        });
    }

    if (isIterable(DetailReference)) {
        DetailReference.forEach(detailReference => {
            const {$: {ID}, _} = detailReference;

            detailReferences[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(DetailType)) {
        DetailType.forEach(detailType => {
            const {$: {ID}, _} = detailType;

            detailTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(DocNameStatus)) {
        DocNameStatus.forEach(docNameStatus => {
            const {$: {ID}, _} = docNameStatus;

            docNameStatuses[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(EntryEventType)) {
        EntryEventType.forEach(entryEventType => {
            const {$: {ID}, _} = entryEventType;

            entryEventTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(EntryLinkType)) {
        EntryLinkType.forEach(entryLinkType => {
            const {$: {ID}, _} = entryLinkType;

            entryLinkTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(ExRefType)) {
        ExRefType.forEach(exRefType => {
            const {$: {ID}, _} = exRefType;

            exRefTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(FeatureTypeGroup)) {
        FeatureTypeGroup.forEach(featureTypeGroup => {
            const {$: {ID}, _} = featureTypeGroup;

            featureTypeGroups[ID] = {
                id: ID,
                value: _,
            }
        });
    }


    if (isIterable(IdentityFeatureLinkType)) {
        IdentityFeatureLinkType.forEach(identityFeatureLink => {
            const {$: {ID}, _} = identityFeatureLink;

            identityFeatureLinkTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(IDRegDocDateType)) {
        IDRegDocDateType.forEach(idRegDocDateType => {
            const {$: {ID}, _} = idRegDocDateType;

            idRegDocDateTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(IDRegDocType)) {
        IDRegDocType.forEach(idRegDocType => {
            const {$: {ID}, _} = idRegDocType;

            idRegDocTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(LegalBasisType)) {
        LegalBasisType.forEach(legalBasisType => {
            const {$: {ID}, _} = legalBasisType;

            legalBasisTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(List)) {
        List.forEach(list => {
            const {$: {ID}, _} = list;

            lists[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(LocPartType)) {
        LocPartType.forEach(locPartType => {
            const {$: {ID}, _} = locPartType;

            locPartTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(LocPartValueStatus)) {
        LocPartValueStatus.forEach(locPartValueStatus => {
            const {$: {ID}, _} = locPartValueStatus;

            locPartValueStatuses[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(LocPartValueType)) {
        LocPartValueType.forEach(locPartValueType => {
            const {$: {ID}, _} = locPartValueType;

            locPartValueTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(NamePartType)) {
        NamePartType.forEach(namePartType => {
            const {$: {ID}, _} = namePartType;

            namePartTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(PartyType)) {
        PartyType.forEach(partyType => {
            const {$: {ID}, _} = partyType;

            partyTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(PartySubType)) {
        PartySubType.forEach(partySubType => {
            const {$: {ID, PartyTypeID}, _} = partySubType;

            partySubTypes[ID] = {
                id: ID,
                value: _,
                partyType: partyTypes[PartyTypeID],
            }
        });
    }

    if (isIterable(RelationQuality)) {
        RelationQuality.forEach(relationQuality => {
            const {$: {ID}, _} = relationQuality;

            relationQualities[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(RelationType)) {
        RelationType.forEach(relationType => {
            const {$: {ID, Symmetrical}, _} = relationType;

            relationTypes[ID] = {
                id: ID,
                value: _,
                symmetrical: Symmetrical,
            }
        });
    }

    if (isIterable(Reliability)) {
        Reliability.forEach(reliability => {
            const {$: {ID}, _} = reliability;

            reliabilities[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(SanctionsType)) {
        SanctionsType.forEach(sanctionsType => {
            const {$: {ID}, _} = sanctionsType;

            sanctionsTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(Script)) {
        Script.forEach(script => {
            const {$: {ID, ScriptCode}, _} = script;

            scripts[ID] = {
                id: ID,
                value: _,
                scriptCode: ScriptCode,
            }
        });
    }

    if (isIterable(ScriptStatus)) {
        ScriptStatus.forEach(scriptStatus => {
            const {$: {ID}, _} = scriptStatus;

            scriptStatuses[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(SupInfoType)) {
        SupInfoType.forEach(supInfoType => {
            const {$: {ID}, _} = supInfoType;

            supInfoTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(TargetType)) {
        TargetType.forEach(target => {
            const {$: {ID}, _} = target;

            targetTypes[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(Validity)) {
        Validity.forEach(validity => {
            const {$: {ID}, _} = validity;

            validities[ID] = {
                id: ID,
                value: _,
            }
        });
    }

    if (isIterable(AreaCode)) {
        AreaCode.forEach(areaCode => {
            const {$: {ID, AreaCodeTypeID, CountryID, Description}, _} = areaCode;

            areaCodes[ID] = {
                id: ID,
                areaCode: _,
                areaCodeType: areaCodeTypes[AreaCodeTypeID].value,
                country: countries[CountryID],
                description: Description,
            }
        });
    }

    if (isIterable(DecisionMakingBody)) {
        DecisionMakingBody.forEach(decisionMakingBody => {
            const {$: {ID, OrganisationID}, _} = decisionMakingBody;

            decisionMakingBodies[ID] = {
                id: ID,
                value: _,
                organisationId: OrganisationID,
            }
        });
    }

    if (isIterable(FeatureType)) {
        FeatureType.forEach(featureType => {
            const {$: {ID, FeatureTypeGroupID}, _} = featureType;

            featureTypes[ID] = {
                id: ID,
                value: _,
                featureTypeGroup: featureTypeGroups[FeatureTypeGroupID]
            }
        });
    }

    if (isIterable(SubsidiaryBody)) {
        SubsidiaryBody.forEach(subsidiaryBody => {
            const {$: {ID, DecisionMakingBodyID, Notional}, _} = subsidiaryBody;

            subsidiaryBodies[ID] = {
                id: ID,
                value: _,
                national: Notional,
                decisionMakingBody: decisionMakingBodies[DecisionMakingBodyID],
            }
        });
    }

    if (isIterable(SanctionsProgram)) {
        SanctionsProgram.forEach(sanctionsProgram => {
            const {$: {ID, SubsidiaryBodyID}, _} = sanctionsProgram;

            sanctionsPrograms[ID] = {
                id: ID,
                value: _,
                subsidiaryBody: subsidiaryBodies[SubsidiaryBodyID],
            }
        });
    }

    if (isIterable(LegalBasis)) {
        LegalBasis.forEach(legalBasis => {
            const {$: {ID, LegalBasisShortRef, LegalBasisTypeID, SanctionsProgramID,}, _} = legalBasis;

            legalBasisis[ID] = {
                id: ID,
                value: _,
                legalBasisRef: LegalBasisShortRef,
                legalBasisType: legalBasisTypes[LegalBasisTypeID],
                sanctionsProgram: sanctionsPrograms[SanctionsProgramID],
            }
        });
    }

    if (isIterable(Organisation)) {
        Organisation.forEach(organisation => {
            const {$: {ID, CountryID}, _} = organisation;

            organisations[ID] = {
                id: ID,
                value: _,
                country: countries[CountryID],
            }
        });
    }

    return {
        aliasTypes,
        areaCodeTypes,
        areaCodes,
        calendarTypes,
        countryRelevances,
        countries,
        decisionMakingBodies,
        detailReferences,
        detailTypes,
        docNameStatuses,
        entryEventTypes,
        entryLinkTypes,
        exRefTypes,
        featureTypes,
        featureTypeGroups,
        idRegDocDateTypes,
        idRegDocTypes,
        identityFeatureLinkTypes,
        legalBasisis,
        legalBasisTypes,
        lists,
        locPartTypes,
        locPartValueStatuses,
        locPartValueTypes,
        namePartTypes,
        organisations,
        partySubTypes,
        partyTypes,
        relationQualities,
        relationTypes,
        reliabilities,
        sanctionsPrograms,
        sanctionsTypes,
        scripts,
        scriptStatuses,
        subsidiaryBodies,
        supInfoTypes,
        targetTypes,
        validities,
    };
};

const extractLocationInfo = (Location, {
    areaCodes,
    countries,
    countryRelevances,
    locPartTypes,
}) => {
    const locations = {};
    Location.forEach(location => {
        const locationInfo = {};

        const {
            $: {ID},
            // LocationAreaCode,
            LocationCountry,
            LocationPart,
        } = location;

        // locationInfo.id = ID;

        // if (isIterable(LocationAreaCode)) {
        //     const [{ $: { AreaCodeID } }] = LocationAreaCode;
        //
        //     locationInfo.areaCode = areaCodes[AreaCodeID];
        // }

        if (isIterable(LocationCountry)) {
            const [{$: {CountryID, CountryRelevanceID}}] = LocationCountry;

            locationInfo.country = countries[CountryID].value;
            // locationInfo.countryRelevance = countryRelevances[CountryRelevanceID];
        }

        if (isIterable(LocationPart)) {
            LocationPart.forEach(locationPart => {
                const {
                    $: {LocPartTypeID},
                    LocationPartValue: [
                        {Value: [locationPartValue]}
                    ],
                } = locationPart;


                locationInfo[locPartTypes[LocPartTypeID].value] = locationPartValue;
            });
        }

        locations[ID] = locationInfo;
    });

    return locations;
};

const extractIdDocuments = (
    IDRegDocument,
    {
        countries,
        idRegDocTypes,
        validities,
    },
    locations,
) => {
    const idRegDocuments = {};

    IDRegDocument.forEach(document => {
        const {
            $: {
                ID, IdentityID, ValidityID, IDRegDocTypeID,
            },
            Comment: [comment],
            IDRegistrationNo: [idRegNo,],
        } = document;

        const documentInfo = {
            // id: ID,
            // identityId: IdentityID,
            comment,
            validity: validities[ValidityID].value,
            country: countries[document['$']['IssuedBy-CountryID']]
                ? countries[document['$']['IssuedBy-CountryID']].value
                : countries[document['$']['IssuedBy-CountryID']],
            location: locations[document['$']['IssuedIn-LocationID']],
            idDocType: idRegDocTypes[IDRegDocTypeID].value,
            idRegNo,
        };

        idRegDocuments[IdentityID] = documentInfo;
    });

    return idRegDocuments;
};

const extractDistinctParties = (
    DistinctParty,
    locations,
    idRegDocuments,
    {
        aliasTypes,
        calendarTypes,
        detailTypes,
        docNameStatuses,
        featureTypes,
        reliabilities,
        namePartTypes,
        identityFeatureLinkTypes,
        partySubTypes,
        scripts,
        scriptStatuses,
    },
) => {
    const distinctParties = {};

    DistinctParty.forEach(party => {
        const {
            $: {FixedRef},
            Comment: [
                comment,
            ],
            Profile: [
                profile,
            ],
        } = party;

        const profileId = profile['$'].ID;
        const profilePartySubTypeId = profile['$'].PartySubTypeID;

        const {
            Feature,
            Identity,
        } = profile;

        const attributes = {};

        if (Feature) {
            Feature.forEach(feature => {
                const {
                    $: {FeatureTypeID},
                    FeatureVersion: [
                        featureVersion,
                    ],
                } = feature;

                const {
                    // $: {ReliabilityID},
                    Comment: [comment],
                    DatePeriod,
                    VersionDetail,
                    VersionLocation,
                } = featureVersion;

                if (VALID_ATTRIBUTE_TYPES[featureTypes[FeatureTypeID].value]) {
                    const attributeInfo = {
                        // type: featureTypes[FeatureTypeID].value,
                        comment: comment,
                        // reliability: reliabilities[ReliabilityID].value,
                        // value: {},
                    };

                    if (isIterable(DatePeriod)) {
                        const [
                            {
                                $: {
                                    CalendarTypeID,
                                    YearFixed,
                                    MonthFixed,
                                    DayFixed,
                                },
                                Start: [start],
                                End: [end],
                            },
                        ] = DatePeriod;

                        const {
                            From: [
                                {
                                    Day: [startDay],
                                    Month: [startMonth],
                                    Year: [startYear],
                                },
                            ],
                        } = start;

                        const {
                            To: [
                                {
                                    Day: [endDay],
                                    Month: [endtMonth],
                                    Year: [endYear],
                                },
                            ],
                        } = end;

                        // attributeInfo.value.datePeriod = {
                        //     // calendarType: calendarTypes[CalendarTypeID].value,
                        //     // yearFixed: YearFixed,
                        //     // monthFixed: MonthFixed,
                        //     // dayFixed: DayFixed,
                        //     startDate: `${startYear}-${startMonth}-${startDay}`,
                        //     endDate: `${endYear}-${endtMonth}-${endDay}`,
                        // };

                        attributeInfo.value = `${startYear}-${startMonth}-${startDay}`;
                    }

                    if (isIterable(VersionDetail)) {
                        const [
                            {
                                $: {DetailTypeID},
                                _,
                            },
                        ] = VersionDetail;

                        if (_) {
                            // attributeInfo.value.detailType = detailTypes[DetailTypeID].value;
                            attributeInfo.value = _;
                        }
                    }

                    if (isIterable(VersionLocation)) {
                        const [
                            {$: {LocationID}}
                        ] = VersionLocation;


                        if (locations[LocationID]) {
                            attributeInfo.value = Object.keys(locations[LocationID])
                                .map(key => locations[LocationID][key])
                                .join(', ');
                        }
                    }

                    attributes[VALID_ATTRIBUTE_TYPES[featureTypes[FeatureTypeID].value]] = attributeInfo.value;
                }
            });
        }

        const [
            {
                $: {ID, Primary, False,},
                Alias,
                NamePartGroups,
            },
        ] = Identity;

        const identityInfo = {
            // id: ID,
            // primary: Primary,
            // isFalse: False,
            // fixedRef: FixedRef,
        };


        if (idRegDocuments[ID]) {
           identityInfo.idDocument = {
               emittedBy: idRegDocuments[ID].country,
               docType: idRegDocuments[ID].idDocType,
               idNo: idRegDocuments[ID].idRegNo,
           };
        }

        const namePartGroups = {};

        if (isIterable(NamePartGroups)) {
            NamePartGroups.forEach(namePartGroup => {
                const {MasterNamePartGroup} = namePartGroup;

                MasterNamePartGroup.forEach(group => {
                    const {
                        NamePartGroup: [{
                            $: {ID, NamePartTypeID},
                        }],
                    } = group;

                    namePartGroups[ID] = {
                        id: ID,
                        namePartType: namePartTypes[NamePartTypeID],
                    };
                });
            });
        }

        if (isIterable(Alias)) {
            identityInfo.aliases = Alias.map(alias => {
                const {
                    $: {FixedRef, AliasTypeID, Primary, LowQuality},
                    DocumentedName,
                } = alias;

                const aliasType = aliasTypes[AliasTypeID].value;

                const aliasInfo = {
                    aliasType,
                    // isPrimary: Primary,
                    // lowQuality: LowQuality,
                    // fixedRef: FixedRef,
                };

                if (isIterable(DocumentedName)) {
                    DocumentedName.forEach(documentName => {
                        const {
                            $: {ID, FixedRef, DocNameStatusID,},
                            DocumentedNamePart,
                        } = documentName;

                        // aliasInfo.value.id = ID;

                        if (isIterable(DocumentedNamePart)) {
                            const values = [];
                            DocumentedNamePart.forEach(namePart => {
                                const {
                                    NamePartValue: [
                                        {
                                            $: {
                                                NamePartGroupID,
                                                // ScriptID,
                                                // ScriptStatusID,
                                                // Acronym,
                                            },
                                            _,
                                        },
                                    ],
                                } = namePart;

                                if (aliasType === 'Name') {
                                    switch (namePartGroups[NamePartGroupID].namePartType.value) {
                                        case ('First Name'):
                                            identityInfo.firstName = _;
                                            break;
                                        case ('Last Name'):
                                            identityInfo.lastName = _;
                                            break;
                                        default:
                                            identityInfo.firstName = _;
                                            break;
                                    }
                                }
                                values.push(_);
                            });

                            aliasInfo.value = values.join(' ');
                        }
                    });
                }

                return aliasInfo;
            });
        }

        const partySubType = partySubTypes[profilePartySubTypeId];

        distinctParties[profileId] = {
            // profileId,
            sanctionType: `${partySubType.value} ${partySubType.partyType.value}`,
            comment,
            ...attributes,
            ...identityInfo,
        };
    });

    return distinctParties;
};

const extractSanctionEntries = (SanctionsEntry, {lists}, distinctParties) => {
    return SanctionsEntry.map(sanctionEntry => {
        const {
            $: {ID, ProfileID, ListID},
            EntryEvent,
            SanctionsMeasure,
        } = sanctionEntry;

        return {
            id: ID,
            ...distinctParties[ProfileID],
            includedInList: lists[ListID].value,
        }
    });
};

const extractUsTreasuryInfo = (httpData) => {
    const {
        Sanctions: {
            DateOfIssue,
            DistinctParties: [
                {DistinctParty},
            ],
            IDRegDocuments: [
                {IDRegDocument},
            ],
            Locations: [
                {Location},
            ],
            ReferenceValueSets,
            SanctionsEntries: [
                {SanctionsEntry},
            ],
        },
    } = httpData;

    const referenceValueSets = extractReferenceValuesSets(ReferenceValueSets);

    const locations = extractLocationInfo(Location, referenceValueSets);

    const idRegDocuments = extractIdDocuments(IDRegDocument, referenceValueSets, locations);

    const distinctParties = extractDistinctParties(DistinctParty, locations, idRegDocuments, referenceValueSets);

    const sanctionEntries = extractSanctionEntries(SanctionsEntry, referenceValueSets, distinctParties);

    return {
        dateOfIssue: setDateOfIssue(DateOfIssue),
        sanctionEntries,
    };
};

const getDateOfIssue = (httpData) => {
    const {
        Sanctions: {
            DateOfIssue,
        },
    } = httpData;

    return setDateOfIssue(DateOfIssue);
};

module.exports = {
    extractUsTreasuryInfo,
    getDateOfIssue,
};