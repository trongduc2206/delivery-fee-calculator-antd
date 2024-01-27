import { Form, FormInstance, Button } from "antd"
import { useState, useEffect } from "react";

/**
 * @author Duc Vu
 * @summary
 * Submit Button with validate configuration for form
 * @param param0 - antd form instance
 */
export const SubmitButton = ({ form }: { form: FormInstance }) => {
    const [submittable, setSubmittable] = useState(false);

    // Watch all values
    const values = Form.useWatch([], form);

    useEffect(() => {
        form.validateFields({ validateOnly: true }).then(
            () => {
                setSubmittable(true);
            },
            () => {
                setSubmittable(false);
            },
        );
    }, [values]);

    return (
        <Button type="primary" htmlType="submit" disabled={!submittable}>
            Submit
        </Button>
    );
};