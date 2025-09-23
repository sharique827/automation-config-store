export const on_search_default = {
  message: {
    catalog: {
      descriptor: {
        name: "ABC Fights Services Solutions",
        images: [
          {
            url: "https://abc-AIRLINE.in/logos/logo.ico",
            size_type: "xs",
          },
        ],
      },
      providers: [
        {
          id: "P1",
          descriptor: {
            name: "ABC Operator Fights Services",
            images: [
              {
                url: "https://operator1.com/logos/logo.ico",
                size_type: "xs",
              },
            ],
          },
          categories: [
            {
              id: "C1",
              descriptor: {
                name: "Economy",
                code: "ECONOMY",
              },
            },
            {
              id: "C2",
              descriptor: {
                name: "Premium Economy",
                code: "PREMIUM_ECONOMY",
              },
            },
            {
              id: "C3",
              descriptor: {
                name: "Business",
                code: "BUSINESS",
              },
            },
            {
              id: "C4",
              descriptor: {
                name: "First Class",
                code: "FIRST_CLASS",
              },
            },
          ],
          items: [
            {
              id: "I1",
              descriptor: {
                name: "Adult",
                code: "ADULT_TICKET",
              },
              quantity: {
                selected: {
                  count: 3,
                },
              },
              category_ids: ["C1"],
              time: {
                label: "JOURNEY_TIME",
                duration: "PT16H30M",
              },
              refund_terms: [
                {
                  refund_eligible: true,
                },
              ],
              cancellation_terms: [
                {
                  external_ref: {
                    url: "https://api.example-bpp.com/pilot/bpp/v1/cancellation_terms.pdf",
                    mimetype: "application/pdf",
                  },
                },
              ],
              add_ons: [
                {
                  id: "A1",
                  descriptor: {
                    name: "meals",
                    code: "MEALS",
                  },
                  quantity: {
                    available: {
                      count: 1,
                    },
                  },
                  price: {
                    currency: "INR",
                    value: "300",
                  },
                },
                {
                  id: "A2",
                  descriptor: {
                    name: "Delayed and Lost Baggage Protection",
                    code: "BAGGAGE",
                  },
                  quantity: {
                    available: {
                      count: 1,
                    },
                  },
                  price: {
                    currency: "INR",
                    value: "500",
                  },
                },
                {
                  id: "A3",
                  descriptor: {
                    name: "Fast Forward",
                    code: "FAST_FORWARD",
                    short_desc:
                      "Get priority check-in & baggage handling services to save time.",
                  },
                  quantity: {
                    available: {
                      count: 1,
                    },
                  },
                  price: {
                    currency: "INR",
                    value: "200",
                  },
                },
                {
                  id: "A4",
                  descriptor: {
                    name: "Travel Assistance",
                    code: "TRAVEL_ASSISTANCE",
                  },
                  quantity: {
                    available: {
                      count: 1,
                    },
                  },
                  price: {
                    currency: "INR",
                    value: "500",
                  },
                },
                {
                  id: "A7",
                  descriptor: {
                    name: "Free Cancellation",
                    code: "FREE_CANCELLATION",
                  },
                  price: {
                    currency: "INR",
                    value: "500",
                  },
                },
                {
                  id: "A8",
                  descriptor: {
                    name: "Free Date Changes",
                    code: "FREE_DATE_CHANGE",
                  },
                  price: {
                    currency: "INR",
                    value: "200",
                  },
                },
              ],
              tags: [
                {
                  descriptor: {
                    code: "FARE_TYPE",
                    name: "Fare Type",
                  },
                  display: true,
                  list: [
                    {
                      descriptor: {
                        code: "REGULAR",
                      },
                    },
                    {
                      descriptor: {
                        code: "STUDENT",
                      },
                    },
                    {
                      descriptor: {
                        code: "SENIOR_CITIZEN",
                      },
                    },
                    {
                      descriptor: {
                        code: "ARMED_FORCES",
                      },
                    },
                    {
                      descriptor: {
                        code: "DOCTORS_NURSES",
                      },
                    },
                  ],
                },
                {
                  descriptor: {
                    code: "GENERAL_INFO",
                    name: "General Info",
                  },
                  display: true,
                  list: [
                    {
                      descriptor: {
                        code: "CABIN_BAGGAGE",
                        name: "Cabin Baggage",
                        short_desc: "Allowed limit for cabin baggage",
                      },
                      value: "7 KG",
                    },
                    {
                      descriptor: {
                        code: "CHECK_IN_BAGGAGE",
                        name: "Check-in Baggage",
                        short_desc: "Allowed limit for checkin baggage",
                      },
                      value: "15 KG",
                    },
                    {
                      descriptor: {
                        code: "PROHIBITED_ITEMS",
                        name: "Prohibited Items",
                      },
                      value: "list of items",
                    },
                  ],
                },
                {
                  descriptor: {
                    code: "FARE_BREAK_UP",
                    name: "Break up",
                  },
                  display: false,
                  list: [
                    {
                      descriptor: {
                        code: "TAX",
                        name: "GST",
                      },
                      value: "62",
                    },
                    {
                      descriptor: {
                        code: "OTHER_CHARGES",
                        name: "Fuel Charge",
                      },
                      value: "0",
                    },
                    {
                      descriptor: {
                        code: "OTHER_CHARGES",
                        name: "Surcharge",
                      },
                      value: "0",
                    },
                    {
                      descriptor: {
                        code: "TAX",
                        name: "cess",
                      },
                      value: "0",
                    },
                    {
                      descriptor: {
                        code: "TAX",
                        name: "Fuel Tax",
                      },
                      value: "0",
                    },
                    {
                      descriptor: {
                        code: "BASE_FARE",
                        name: "Base Fare",
                      },
                      value: "9280",
                    },
                  ],
                },
              ],
              fulfillment_ids: ["F1"],
              price: {
                currency: "INR",
                value: "9280",
              },
            },
            {
              id: "I3",
              descriptor: {
                name: "Adult",
                code: "ADULT_TICKET",
              },
              quantity: {
                selected: {
                  count: 3,
                },
              },
              category_ids: ["C1"],
              time: {
                label: "JOURNEY_TIME",
                duration: "PT16H30M",
              },
              refund_terms: [
                {
                  refund_eligible: true,
                },
              ],
              cancellation_terms: [
                {
                  external_ref: {
                    url: "https://api.example-bpp.com/pilot/bpp/v1/cancellation_terms.pdf",
                    mimetype: "application/pdf",
                  },
                },
              ],
              add_ons: [
                {
                  id: "A1",
                  descriptor: {
                    name: "meals",
                    code: "MEALS",
                  },
                  quantity: {
                    available: {
                      count: 1,
                    },
                  },
                  price: {
                    currency: "INR",
                    value: "300",
                  },
                },
                {
                  id: "A2",
                  descriptor: {
                    name: "Delayed and Lost Baggage Protection",
                    code: "BAGGAGE",
                  },
                  quantity: {
                    available: {
                      count: 1,
                    },
                  },
                  price: {
                    currency: "INR",
                    value: "500",
                  },
                },
                {
                  id: "A3",
                  descriptor: {
                    name: "Fast Forward",
                    code: "FAST_FORWARD",
                    short_desc:
                      "Get priority check-in & baggage handling services to save time.",
                  },
                  quantity: {
                    available: {
                      count: 1,
                    },
                  },
                  price: {
                    currency: "INR",
                    value: "200",
                  },
                },
                {
                  id: "A4",
                  descriptor: {
                    name: "Travel Assistance",
                    code: "TRAVEL_ASSISTANCE",
                  },
                  quantity: {
                    available: {
                      count: 1,
                    },
                  },
                  price: {
                    currency: "INR",
                    value: "500",
                  },
                },
                {
                  id: "A7",
                  descriptor: {
                    name: "Free Cancellation",
                    code: "FREE_CANCELLATION",
                  },
                  price: {
                    currency: "INR",
                    value: "500",
                  },
                },
                {
                  id: "A8",
                  descriptor: {
                    name: "Free Date Changes",
                    code: "FREE_DATE_CHANGE",
                  },
                  price: {
                    currency: "INR",
                    value: "200",
                  },
                },
              ],
              tags: [
                {
                  descriptor: {
                    code: "FARE_TYPE",
                    name: "Fare Type",
                  },
                  display: true,
                  list: [
                    {
                      descriptor: {
                        code: "REGULAR",
                      },
                    },
                    {
                      descriptor: {
                        code: "STUDENT",
                      },
                    },
                    {
                      descriptor: {
                        code: "SENIOR_CITIZEN",
                      },
                    },
                    {
                      descriptor: {
                        code: "ARMED_FORCES",
                      },
                    },
                    {
                      descriptor: {
                        code: "DOCTORS_NURSES",
                      },
                    },
                  ],
                },
                {
                  descriptor: {
                    code: "GENERAL_INFO",
                    name: "General Info",
                  },
                  display: true,
                  list: [
                    {
                      descriptor: {
                        code: "CABIN_BAGGAGE",
                        name: "Cabin Baggage",
                        short_desc: "Allowed limit for cabin baggage",
                      },
                      value: "7 KG",
                    },
                    {
                      descriptor: {
                        code: "CHECK_IN_BAGGAGE",
                        name: "Check-in Baggage",
                        short_desc: "Allowed limit for checkin baggage",
                      },
                      value: "15 KG",
                    },
                    {
                      descriptor: {
                        code: "PROHIBITED_ITEMS",
                        name: "Prohibited Items",
                      },
                      value: "list of items",
                    },
                  ],
                },
                {
                  descriptor: {
                    code: "FARE_BREAK_UP",
                    name: "Break up",
                  },
                  display: false,
                  list: [
                    {
                      descriptor: {
                        code: "TAX",
                        name: "GST",
                      },
                      value: "62",
                    },
                    {
                      descriptor: {
                        code: "OTHER_CHARGES",
                        name: "Fuel Charge",
                      },
                      value: "0",
                    },
                    {
                      descriptor: {
                        code: "OTHER_CHARGES",
                        name: "Surcharge",
                      },
                      value: "0",
                    },
                    {
                      descriptor: {
                        code: "TAX",
                        name: "cess",
                      },
                      value: "0",
                    },
                    {
                      descriptor: {
                        code: "TAX",
                        name: "Fuel Tax",
                      },
                      value: "0",
                    },
                    {
                      descriptor: {
                        code: "BASE_FARE",
                        name: "Base Fare",
                      },
                      value: "9280",
                    },
                  ],
                },
              ],
              fulfillment_ids: ["F2", "F3", "F4"],
              price: {
                currency: "INR",
                value: "9280",
              },
            },
            {
              id: "I2",
              descriptor: {
                name: "Child",
                code: "CHILD_TICKET",
              },
              quantity: {
                selected: {
                  count: 2,
                },
              },
              category_ids: ["C1"],
              time: {
                label: "JOURNEY_TIME",
                duration: "PT16H30M",
              },
              refund_terms: [
                {
                  refund_eligible: true,
                },
              ],
              cancellation_terms: [
                {
                  external_ref: {
                    url: "https://api.example-bpp.com/pilot/bpp/v1/cancellation_terms.pdf",
                    mimetype: "application/pdf",
                  },
                },
              ],
              add_ons: [
                {
                  id: "A1",
                  descriptor: {
                    name: "meals",
                    code: "MEALS",
                  },
                  quantity: {
                    available: {
                      count: 1,
                    },
                  },
                  price: {
                    currency: "INR",
                    value: "300",
                  },
                },
                {
                  id: "A2",
                  descriptor: {
                    name: "Delayed and Lost Baggage Protection",
                    code: "BAGGAGE",
                  },
                  quantity: {
                    available: {
                      count: 1,
                    },
                  },
                  price: {
                    currency: "INR",
                    value: "500",
                  },
                },
                {
                  id: "A3",
                  descriptor: {
                    name: "Fast Forward",
                    code: "FAST_FORWARD",
                    short_desc:
                      "Get priority check-in & baggage handling services to save time.",
                  },
                  quantity: {
                    available: {
                      count: 1,
                    },
                  },
                  price: {
                    currency: "INR",
                    value: "200",
                  },
                },
                {
                  id: "A4",
                  descriptor: {
                    name: "Travel Assistance",
                    code: "TRAVEL_ASSISTANCE",
                  },
                  quantity: {
                    available: {
                      count: 1,
                    },
                  },
                  price: {
                    currency: "INR",
                    value: "500",
                  },
                },
                {
                  id: "A7",
                  descriptor: {
                    name: "Free Cancellation",
                    code: "FREE_CANCELLATION",
                  },
                  price: {
                    currency: "INR",
                    value: "500",
                  },
                },
                {
                  id: "A8",
                  descriptor: {
                    name: "Free Date Changes",
                    code: "FREE_DATE_CHANGE",
                  },
                  price: {
                    currency: "INR",
                    value: "200",
                  },
                },
              ],
              tags: [
                {
                  descriptor: {
                    code: "FARE_TYPE",
                    name: "Fare Type",
                  },
                  display: true,
                  list: [
                    {
                      descriptor: {
                        code: "REGULAR",
                      },
                    },
                    {
                      descriptor: {
                        code: "STUDENT",
                      },
                    },
                    {
                      descriptor: {
                        code: "SENIOR_CITIZEN",
                      },
                    },
                    {
                      descriptor: {
                        code: "ARMED_FORCES",
                      },
                    },
                    {
                      descriptor: {
                        code: "DOCTORS_NURSES",
                      },
                    },
                  ],
                },
                {
                  descriptor: {
                    code: "GENERAL_INFO",
                    name: "General Info",
                  },
                  display: true,
                  list: [
                    {
                      descriptor: {
                        code: "CABIN_BAGGAGE",
                        name: "Cabin Baggage",
                        short_desc: "Allowed limit for cabin baggage",
                      },
                      value: "7 KG",
                    },
                    {
                      descriptor: {
                        code: "CHECK_IN_BAGGAGE",
                        name: "Check-in Baggage",
                        short_desc: "Allowed limit for checkin baggage",
                      },
                      value: "15 KG",
                    },
                    {
                      descriptor: {
                        code: "PROHIBITED_ITEMS",
                        name: "Prohibited Items",
                      },
                      value: "list of items",
                    },
                  ],
                },
                {
                  descriptor: {
                    code: "FARE_BREAK_UP",
                    name: "Break up",
                  },
                  display: false,
                  list: [
                    {
                      descriptor: {
                        code: "TAX",
                        name: "GST",
                      },
                      value: "62",
                    },
                    {
                      descriptor: {
                        code: "OTHER_CHARGES",
                        name: "Fuel Charge",
                      },
                      value: "0",
                    },
                    {
                      descriptor: {
                        code: "OTHER_CHARGES",
                        name: "Surcharge",
                      },
                      value: "0",
                    },
                    {
                      descriptor: {
                        code: "TAX",
                        name: "cess",
                      },
                      value: "0",
                    },
                    {
                      descriptor: {
                        code: "TAX",
                        name: "Fuel Tax",
                      },
                      value: "0",
                    },
                    {
                      descriptor: {
                        code: "BASE_FARE",
                        name: "Base Fare",
                      },
                      value: "4280",
                    },
                  ],
                },
              ],
              fulfillment_ids: ["F1"],
              price: {
                currency: "INR",
                value: "4280",
              },
            },
            {
              id: "I4",
              descriptor: {
                name: "Child",
                code: "CHILD_TICKET",
              },
              quantity: {
                selected: {
                  count: 2,
                },
              },
              category_ids: ["C1"],
              time: {
                label: "JOURNEY_TIME",
                duration: "PT16H30M",
              },
              refund_terms: [
                {
                  refund_eligible: true,
                },
              ],
              cancellation_terms: [
                {
                  external_ref: {
                    url: "https://api.example-bpp.com/pilot/bpp/v1/cancellation_terms.pdf",
                    mimetype: "application/pdf",
                  },
                },
              ],
              add_ons: [
                {
                  id: "A1",
                  descriptor: {
                    name: "meals",
                    code: "MEALS",
                  },
                  quantity: {
                    available: {
                      count: 1,
                    },
                  },
                  price: {
                    currency: "INR",
                    value: "300",
                  },
                },
                {
                  id: "A2",
                  descriptor: {
                    name: "Delayed and Lost Baggage Protection",
                    code: "BAGGAGE",
                  },
                  quantity: {
                    available: {
                      count: 1,
                    },
                  },
                  price: {
                    currency: "INR",
                    value: "500",
                  },
                },
                {
                  id: "A3",
                  descriptor: {
                    name: "Fast Forward",
                    code: "FAST_FORWARD",
                    short_desc:
                      "Get priority check-in & baggage handling services to save time.",
                  },
                  quantity: {
                    available: {
                      count: 1,
                    },
                  },
                  price: {
                    currency: "INR",
                    value: "200",
                  },
                },
                {
                  id: "A4",
                  descriptor: {
                    name: "Travel Assistance",
                    code: "TRAVEL_ASSISTANCE",
                  },
                  quantity: {
                    available: {
                      count: 1,
                    },
                  },
                  price: {
                    currency: "INR",
                    value: "500",
                  },
                },
                {
                  id: "A7",
                  descriptor: {
                    name: "Free Cancellation",
                    code: "FREE_CANCELLATION",
                  },
                  price: {
                    currency: "INR",
                    value: "500",
                  },
                },
                {
                  id: "A8",
                  descriptor: {
                    name: "Free Date Changes",
                    code: "FREE_DATE_CHANGE",
                  },
                  price: {
                    currency: "INR",
                    value: "200",
                  },
                },
              ],
              tags: [
                {
                  descriptor: {
                    code: "FARE_TYPE",
                    name: "Fare Type",
                  },
                  display: true,
                  list: [
                    {
                      descriptor: {
                        code: "REGULAR",
                      },
                    },
                    {
                      descriptor: {
                        code: "STUDENT",
                      },
                    },
                    {
                      descriptor: {
                        code: "SENIOR_CITIZEN",
                      },
                    },
                    {
                      descriptor: {
                        code: "ARMED_FORCES",
                      },
                    },
                    {
                      descriptor: {
                        code: "DOCTORS_NURSES",
                      },
                    },
                  ],
                },
                {
                  descriptor: {
                    code: "GENERAL_INFO",
                    name: "General Info",
                  },
                  display: true,
                  list: [
                    {
                      descriptor: {
                        code: "CABIN_BAGGAGE",
                        name: "Cabin Baggage",
                        short_desc: "Allowed limit for cabin baggage",
                      },
                      value: "7 KG",
                    },
                    {
                      descriptor: {
                        code: "CHECK_IN_BAGGAGE",
                        name: "Check-in Baggage",
                        short_desc: "Allowed limit for checkin baggage",
                      },
                      value: "15 KG",
                    },
                    {
                      descriptor: {
                        code: "PROHIBITED_ITEMS",
                        name: "Prohibited Items",
                      },
                      value: "list of items",
                    },
                  ],
                },
                {
                  descriptor: {
                    code: "FARE_BREAK_UP",
                    name: "Break up",
                  },
                  display: false,
                  list: [
                    {
                      descriptor: {
                        code: "TAX",
                        name: "GST",
                      },
                      value: "62",
                    },
                    {
                      descriptor: {
                        code: "OTHER_CHARGES",
                        name: "Fuel Charge",
                      },
                      value: "0",
                    },
                    {
                      descriptor: {
                        code: "OTHER_CHARGES",
                        name: "Surcharge",
                      },
                      value: "0",
                    },
                    {
                      descriptor: {
                        code: "TAX",
                        name: "cess",
                      },
                      value: "0",
                    },
                    {
                      descriptor: {
                        code: "TAX",
                        name: "Fuel Tax",
                      },
                      value: "0",
                    },
                    {
                      descriptor: {
                        code: "BASE_FARE",
                        name: "Base Fare",
                      },
                      value: "4280",
                    },
                  ],
                },
              ],
              fulfillment_ids: ["F2", "F3", "F4"],
              price: {
                currency: "INR",
                value: "4280",
              },
            },
          ],
          payments: [
            {
              tags: [
                {
                  descriptor: {
                    code: "BUYER_FINDER_FEES",
                  },
                  display: false,
                  list: [
                    {
                      descriptor: {
                        code: "BUYER_FINDER_FEES_PERCENTAGE",
                      },
                      value: "1",
                    },
                  ],
                },
                {
                  descriptor: {
                    code: "SETTLEMENT_TERMS",
                  },
                  display: false,
                  list: [
                    {
                      descriptor: {
                        code: "SETTLEMENT_WINDOW",
                      },
                      value: "PT30D",
                    },
                    {
                      descriptor: {
                        code: "SETTLEMENT_BASIS",
                      },
                      value: "INVOICE_RECEIPT",
                    },
                    {
                      descriptor: {
                        code: "MANDATORY_ARBITRATION",
                      },
                      value: "TRUE",
                    },
                    {
                      descriptor: {
                        code: "COURT_JURISDICTION",
                      },
                      value: "New Delhi",
                    },
                    {
                      descriptor: {
                        code: "STATIC_TERMS",
                      },
                      value: "https://api.example-bap.com/booking/terms",
                    },
                  ],
                },
              ],
            },
          ],
          fulfillments: [
            {
              id: "F1",
              type: "TRIP",
              stops: [
                {
                  id: "S1",
                  type: "START",
                  location: {
                    descriptor: {
                      name: "Delhi",
                      code: "DEL",
                    },
                  },
                  time: {
                    label: "DATE_TIME",
                    timestamp: "2023-10-15T20:00:00.000Z",
                  },
                },
                {
                  id: "S2",
                  type: "END",
                  location: {
                    descriptor: {
                      name: "Bengaluru",
                      code: "BLR",
                    },
                  },
                  time: {
                    label: "DATE_TIME",
                    timestamp: "2023-10-15T20:00:00.000Z",
                  },
                },
              ],
              vehicle: {
                category: "AIRLINE",
                code: "6E284",
              },
              tags: [
                {
                  descriptor: {
                    code: "INFO",
                    name: "Info",
                  },
                  display: true,
                  list: [
                    {
                      descriptor: {
                        code: "OPERATED_BY",
                      },
                      value: "AirIndia",
                    },
                  ],
                },
              ],
            },
            {
              id: "F2",
              type: "CONNECT",
              stops: [
                {
                  id: "S1",
                  type: "START",
                  location: {
                    descriptor: {
                      name: "Delhi",
                      code: "DEL",
                    },
                  },
                  time: {
                    label: "DATE_TIME",
                    timestamp: "2023-10-15T20:00:00.000Z",
                  },
                },
                {
                  id: "S2",
                  type: "LAYOVER",
                  location: {
                    descriptor: {
                      name: "Mumbai",
                      code: "BOM",
                    },
                  },
                  time: {
                    label: "DATE_TIME",
                    range: {
                      start: "2024-12-26T15:00:00Z",
                      end: "2024-12-27T05:05:00Z",
                    },
                    duration: "PT14H5M",
                  },
                },
                {
                  id: "S3",
                  type: "END",
                  location: {
                    descriptor: {
                      name: "Bengaluru",
                      code: "BLR",
                    },
                  },
                  time: {
                    label: "DATE_TIME",
                    timestamp: "2023-10-15T20:00:00.000Z",
                  },
                },
              ],
              vehicle: {
                category: "AIRLINE",
                code: "6E281",
              },
              tags: [
                {
                  descriptor: {
                    code: "INFO",
                    name: "Info",
                  },
                  display: true,
                  list: [
                    {
                      descriptor: {
                        code: "FULFILLMENT_SEQUENCE",
                      },
                      value: "F3, F4",
                    },
                    {
                      descriptor: {
                        code: "OPERATED_BY",
                      },
                      value: "AirIndia",
                    },
                  ],
                },
              ],
            },
            {
              id: "F3",
              type: "TRIP",
              stops: [
                {
                  id: "S1",
                  type: "START",
                  location: {
                    descriptor: {
                      name: "Delhi",
                      code: "DEL",
                    },
                  },
                  time: {
                    label: "DATE_TIME",
                    timestamp: "2023-10-15T20:00:00.000Z",
                  },
                },
                {
                  id: "S2",
                  type: "END",
                  location: {
                    descriptor: {
                      name: "Mumbai",
                      code: "BOM",
                    },
                  },
                  time: {
                    label: "DATE_TIME",
                    timestamp: "2023-10-17T20:00:00.000Z",
                  },
                },
              ],
              vehicle: {
                category: "AIRLINE",
                code: "6E286",
              },
              tags: [
                {
                  descriptor: {
                    code: "INFO",
                    name: "Info",
                  },
                  display: true,
                  list: [
                    {
                      descriptor: {
                        code: "PARENT_ID",
                      },
                      value: "F2",
                    },
                    {
                      descriptor: {
                        code: "OPERATED_BY",
                      },
                      value: "AirIndia",
                    },
                  ],
                },
              ],
            },
            {
              id: "F4",
              type: "TRIP",
              stops: [
                {
                  id: "S1",
                  type: "START",
                  location: {
                    descriptor: {
                      name: "Mumbai",
                      code: "BOM",
                    },
                  },
                  time: {
                    label: "DATE_TIME",
                    timestamp: "2023-10-19T20:00:00.000Z",
                  },
                },
                {
                  id: "S2",
                  type: "END",
                  location: {
                    descriptor: {
                      name: "Bengaluru",
                      code: "BLR",
                    },
                  },
                  time: {
                    label: "DATE_TIME",
                    timestamp: "2023-10-21T20:00:00.000Z",
                  },
                },
              ],
              vehicle: {
                category: "AIRLINE",
                code: "6E287",
              },
              tags: [
                {
                  descriptor: {
                    code: "INFO",
                    name: "Info",
                  },
                  display: true,
                  list: [
                    {
                      descriptor: {
                        code: "PARENT_ID",
                      },
                      value: "F2",
                    },
                    {
                      descriptor: {
                        code: "OPERATED_BY",
                      },
                      value: "AirIndia",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      tags: [
        {
          descriptor: {
            code: "PAGINATION",
            name: "Pagination",
          },
          display: true,
          list: [
            {
              descriptor: {
                code: "PAGINATION_ID",
              },
              value: "P1",
            },
            {
              descriptor: {
                code: "MAX_PAGE_NUMBER",
              },
              value: "3",
            },
            {
              descriptor: {
                code: "CURRENT_PAGE_NUMBER",
              },
              value: "3",
            },
          ],
        },
      ],
    },
  },
};
