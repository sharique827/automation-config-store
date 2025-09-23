const exampleFullfillment = {
	fulfillments: [
            {
              "id": "F1",
              "type": "ROUTE",
              "stops": [
                {
                  "type": "START",
                  "location": {
                    "descriptor": {
                      "name": "kashmere gate",
                      "code": "KASHMERE_GATE"
                    },
                    "gps": "28.666576, 77.233332"
                  },
                  "id": "1"
                },
                {
                  "type": "INTERMEDIATE_STOP",
                  "instructions": {
                    "name": "Stop 1"
                  },
                  "location": {
                    "descriptor": {
                      "name": "Indira Gandhi Technical Unviversity",
                      "code": "INDIRA_GANDHI_TECHNICAL_UNIV"
                    },
                    "gps": "28.624097, 77.204991"
                  },
                  "id": "2",
                  "parent_stop_id": "1"
                },
                {
                  "type": "INTERMEDIATE_STOP",
                  "instructions": {
                    "name": "Stop 2"
                  },
                  "location": {
                    "descriptor": {
                      "name": "Yamuna Bazar",
                      "code": "YAMUNA_BAZAR"
                    },
                    "gps": "28.625972,77.209917"
                  },
                  "id": "3",
                  "parent_stop_id": "2"
                },
                {
                  "type": "INTERMEDIATE_STOP",
                  "instructions": {
                    "name": "Stop 3"
                  },
                  "location": {
                    "descriptor": {
                      "name": "dhaula kuan",
                      "code": "DHAULA_KUAN"
                    },
                    "gps": "28.610972,77.201717"
                  },
                  "id": "4",
                  "parent_stop_id": "3"
                },
                {
                  "type": "INTERMEDIATE_STOP",
                  "instructions": {
                    "name": "Stop 4"
                  },
                  "location": {
                    "descriptor": {
                      "name": "gpo",
                      "code": "GPO"
                    },
                    "gps": "28.623097,77.209917"
                  },
                  "id": "5",
                  "parent_stop_id": "4"
                },
                {
                  "type": "END",
                  "location": {
                    "descriptor": {
                      "name": "Greater Kailash",
                      "code": "GREATER_KAILASH"
                    },
                    "gps": "28.548230, 77.238039"
                  },
                  "id": "6",
                  "parent_stop_id": "5"
                }
              ],
              "vehicle": {
                "category": "BUS"
              },
              "tags": [
                {
                  "descriptor": {
                    "code": "ROUTE_INFO"
                  },
                  "list": [
                    {
                      "descriptor": {
                        "code": "ROUTE_ID"
                      },
                      "value": "242"
                    },
                    {
                      "descriptor": {
                        "code": "ROUTE_DIRECTION"
                      },
                      "value": "UP"
                    }
                  ]
                }
              ]
            },
            {
              "id": "F2",
              "type": "ROUTE",
              "stops": [
                {
                  "type": "START",
                  "location": {
                    "descriptor": {
                      "name": "Greater Kailash",
                      "code": "GREATER_KAILASH"
                    },
                    "gps": "28.548230, 77.238039"
                  },
                  "id": "1"
                },
                {
                  "type": "INTERMEDIATE_STOP",
                  "instructions": {
                    "name": "Stop 1"
                  },
                  "location": {
                    "descriptor": {
                      "name": "gpo",
                      "code": "GPO"
                    },
                    "gps": "28.623097,77.209917"
                  },
                  "id": "2",
                  "parent_stop_id": "1"
                },
                {
                  "type": "INTERMEDIATE_STOP",
                  "instructions": {
                    "name": "Stop 2"
                  },
                  "location": {
                    "descriptor": {
                      "name": "dhaula kuan",
                      "code": "DHAULA_KUAN"
                    },
                    "gps": "28.610972,77.201717"
                  },
                  "id": "3",
                  "parent_stop_id": "2"
                },
                {
                  "type": "INTERMEDIATE_STOP",
                  "instructions": {
                    "name": "Stop 3"
                  },
                  "location": {
                    "descriptor": {
                      "name": "Yamuna Bazar",
                      "code": "YAMUNA_BAZAR"
                    },
                    "gps": "28.625972,77.209917"
                  },
                  "id": "4",
                  "parent_stop_id": "3"
                },
                {
                  "type": "INTERMEDIATE_STOP",
                  "instructions": {
                    "name": "Stop 4"
                  },
                  "location": {
                    "descriptor": {
                      "name": "Indira Gandhi Technical Unviversity",
                      "code": "INDIRA_GANDHI_TECHNICAL_UNIV"
                    },
                    "gps": "28.624097, 77.204991"
                  },
                  "id": "5",
                  "parent_stop_id": "4"
                },
                {
                  "type": "END",
                  "location": {
                    "descriptor": {
                      "name": "kashmere gate",
                      "code": "KASHMERE_GATE"
                    },
                    "gps": "28.666576, 77.233332"
                  },
                  "id": "6",
                  "parent_stop_id": "5"
                }
              ],
              "vehicle": {
                "category": "BUS"
              },
              "tags": [
                {
                  "descriptor": {
                    "code": "ROUTE_INFO"
                  },
                  "list": [
                    {
                      "descriptor": {
                        "code": "ROUTE_ID"
                      },
                      "value": "242"
                    },
                    {
                      "descriptor": {
                        "code": "ROUTE_DIRECTION"
                      },
                      "value": "DOWN"
                    }
                  ]
                }
              ]
            }
        ]
};

export function createFullfillment(cityCode: string) {
    const fake = exampleFullfillment.fulfillments;
    const stopNameMap = new Map(); // To ensure names are consistent across fulfillments
    let index = 1;
    let maxIndex = fake[0].stops.length; // Get the max index from the first fulfillment

    for (const full of fake) {
        if (full.id === "F1") {
            full.stops.forEach((stop: any) => {
                stop.location.descriptor.code = `MOCK_STATION_${index}`;
                index++;
            });
        } else if (full.id === "F2") {
            full.stops.forEach((stop: any) => {
                stop.location.descriptor.code = `MOCK_STATION_${maxIndex}`;
                maxIndex--;
            });
        }
    }
    
    return { fulfillments: fake };
}
