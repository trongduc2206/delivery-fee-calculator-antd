import { Divider, Form, Row, Col, InputNumber, DatePicker} from "antd"
import MainLayout from "../layouts/MainLayout"
import { useEffect, useState } from "react";
import './DeliveryFeeCalculator.css';
import { SubmitButton } from "../components/SubmitButton";

/**
 * @author Duc Vu
 * @summary
 * Delivery Fee Calculator Page
 */
function DeliveryFeeCalculator() {
    const [form] = Form.useForm();

    const [deliveryFeeResult, setDeliveryFeeResult] = useState<number>();

    // CONSTANTS OF LIMIT
    const BASE_CART_VALUE: number = 10;
    const BASE_AMOUNT_OF_ITEMS: number = 5;
    const AMOUNT_OF_ITEMS_BULK_LIMIT: number = 12;
    const BASE_DELIVERY_DISTANCE: number = 1000;
    const RUSH_HOUR_MULTIPLIER: number = 1.2;
    const DELIVERY_FEE_UPPER_LIMIT: number = 15;
    const FREE_FEE_CART_VALUE: number = 200;

    // CONSTANT OF FEE IN EURO
    const BASE_DELIVERY_FEE: number = 2;
    const ADDITIONAL_DELIVERY_FEE_PER_500M: number = 1; // in euro
    const BULK_FEE: number = 1.2; // in euro
    const ADDITIONAL_SURCHARGE_PER_ITEM: number = 0.5; // in euro

    /**
     * Input data from form
     */
    type InputData = {
        cartValue: number,
        deliveryDistance: number,
        numberOfItems: number,
        orderTime: any
    }

    /**
     * Function to handle form submit
     * @param values - Input data to calculate delivery fee
     */
    const onFormSubmit = (values: InputData) => {
        setDeliveryFeeResult(undefined)
        let cartValue = values.cartValue;
        let deliveryDistance = values.deliveryDistance;
        let numberOfItems = values.numberOfItems;
        let orderTime = values.orderTime;

        let deliveryFee: number = 0;
        // check whether delivery is free
        if (cartValue < FREE_FEE_CART_VALUE) {
            //calculate surcharge
            let decimalPlaces: number = (cartValue.toString().split('.')[1] || []).length;
            let surcharge: number = 0;
            //calculate surcharge by cart value
            if (cartValue < BASE_CART_VALUE) {
                surcharge = BASE_CART_VALUE - cartValue;
                surcharge = parseFloat(surcharge.toFixed(decimalPlaces))
            }

            //calculate surcharge by amount of items
            if (numberOfItems >= BASE_AMOUNT_OF_ITEMS) {
                let numOfExceedItems: number = numberOfItems - (BASE_AMOUNT_OF_ITEMS - 1);
                surcharge += numOfExceedItems * ADDITIONAL_SURCHARGE_PER_ITEM;
            }
            console.log(`surcharge after amount of item is ${surcharge}`)

            if (numberOfItems > AMOUNT_OF_ITEMS_BULK_LIMIT) {
                surcharge += BULK_FEE;
                surcharge = parseFloat(surcharge.toFixed(decimalPlaces))
            }
            console.log(`surcharge is ${surcharge}`);

            // calculate delivery fee by delivery distance
            if (deliveryDistance <= BASE_DELIVERY_DISTANCE) {
                deliveryFee = BASE_DELIVERY_FEE;
            } else {
                let addtionalDeliveryDistance: number = deliveryDistance - BASE_DELIVERY_DISTANCE
                console.log(`additional distance is ${addtionalDeliveryDistance}`);
                let additionalDeliveryFee: number = Math.ceil(addtionalDeliveryDistance / 500) * ADDITIONAL_DELIVERY_FEE_PER_500M;
                console.log(addtionalDeliveryDistance / 500);
                deliveryFee = BASE_DELIVERY_FEE + additionalDeliveryFee;
            }

            // add surcharge to delivery fee
            deliveryFee += surcharge

            // check rush hour
            if (orderTime.$d.getDay() === 5) {
                if (orderTime.$H >= 15 && orderTime.$H <= 19) {
                    deliveryFee = deliveryFee * RUSH_HOUR_MULTIPLIER;
                    deliveryFee = parseFloat(deliveryFee.toFixed(decimalPlaces))
                }
            }

            //check upper limit of delivery fee
            if (deliveryFee > DELIVERY_FEE_UPPER_LIMIT) {
                deliveryFee = DELIVERY_FEE_UPPER_LIMIT;
            }

            // console.log(`delivery fee is ${deliveryFee}`)
            setTimeout(() => { setDeliveryFeeResult(deliveryFee); }, 100)
        }

    };

    /**
     * validation message for form
     */
    const validateMessages = {
        required: "This field is required!",
        types: {
            integer: "Please enter a positive integer",
            number: "Please enter a positive number"
        }
    };

    return (
        <MainLayout>
            <Divider orientation="left" className="divider">Delivery Fee Calculator</Divider>
            <Form form={form} onFinish={onFormSubmit} validateMessages={validateMessages}>
                <Row gutter={{ sm: 8, md: 24, lg: 32 }}>
                    {/* cart value input */}
                    <Col sm={24} lg={12}>
                        <Form.Item
                            className="input" name='cartValue' label='Cart value'
                            rules={[{ required: true, type: 'number' }]}
                            tooltip="Value of the shopping cart in euros"
                        >
                            <InputNumber placeholder="0.00" addonAfter='€' min="0" data-test-id='cartValue'></InputNumber>
                        </Form.Item>
                    </Col>
                    {/* delivery distance input */}
                    <Col sm={24} lg={12}>
                        <Form.Item
                            name='deliveryDistance' label='Delivery distance'
                            rules={[{ required: true, type: 'integer' }]}
                            tooltip="The distance between the store and customer’s location in meters"
                        >
                            <InputNumber placeholder="0" addonAfter='m' min='0' data-test-id='deliveryDistance'></InputNumber>
                        </Form.Item>
                    </Col>
                    {/* number of items input */}
                    <Col sm={24} lg={12}>
                        <Form.Item
                            name='numberOfItems' label='Number of items'
                            rules={[{ required: true, type: 'integer' }]}
                            tooltip="The number of items in the customer's shopping cart"
                        >
                            <InputNumber placeholder="0" min='0' data-test-id='numberOfItems'></InputNumber>
                        </Form.Item>
                    </Col>
                    {/* order time input */}
                    <Col sm={24} lg={12}>
                        <Form.Item
                            name='orderTime' label='Order time'
                            rules={[{ required: true }]}
                            tooltip="The date/time when the order is being made"
                        >
                            <DatePicker showTime data-test-id='orderTime' />
                        </Form.Item>
                    </Col>
                    {/* submit button */}
                    <Col span={24}>
                        <SubmitButton form={form} />
                    </Col>
                </Row>
            </Form>
            {/* result for delivery fee */}
            {
                deliveryFeeResult !== undefined && (
                    <div>
                        <Divider orientation="left" className="divider">Result</Divider>
                        <p data-test-id='fee' className="result-text">{`Delivery price: ${deliveryFeeResult} €`}</p>
                    </div>
                )
            }
        </MainLayout>
    )
}

export default DeliveryFeeCalculator