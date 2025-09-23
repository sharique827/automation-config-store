export interface SessionData {
	subscriber_url: string | undefined;
	transaction_id: string | undefined;
	message_id: string | undefined;
	last_action: string | undefined;
	mock_type: string | undefined;
	city_code: string | undefined;
	bap_id: string | undefined;
	bap_uri: string | undefined;
	bpp_id: string | undefined;
	bpp_uri: string | undefined;
	start_code: string | undefined;
	end_code: string | undefined;
	buyer_app_fee: string | undefined;
	vehicle_type: string | undefined;
	fulfillments: any[]; // Replace `any` with a specific type if known
	category_ids: string[]; // Assuming these are strings; adjust if needed
	provider_id: string | undefined;
	fullfillment_ids: string[]; // Assuming these are strings; adjust if needed
	item_ids: string[]; // Assuming these are strings; adjust if needed
	items: any[]; // Replace `any` with a specific type if known
	selected_items: any[];
	selected_item_ids: string[]; // Assuming these are strings; adjust if needed
	billing: Record<string, any>; // Replace `any` with specific types if known
	payments: any[]; // Replace `any` with a specific type if known
	updated_payments: any[]; // Replace `any` with a specific type if known
	order_id: string | undefined;
	quote: any;
	status: string;
	error_code: string | undefined;
	error_message: string | undefined;
	ref_id: string | undefined;
	ttl: string;
	usecaseId : string | undefined;
	collected_by: string
	price: string
	payment_id: string
	created_at: string
	update_fulfillment: any[]
	buyer_side_fulfillment_ids: any[]
	first_form_testing: any[]
	user_inputs: any
}

export type BecknContext = {
	action: string;
	bap_id: string;
	bap_uri: string;
	bpp_id?: string;
	bpp_uri?: string;
	domain: string;
	location: {
		city: {
			code: string;
		};
		country: {
			code: string;
		};
	};
	message_id: string;
	timestamp: string;
	transaction_id: string;
	ttl: string;
	version: string;
};
