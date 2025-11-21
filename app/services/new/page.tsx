import { ServiceForm } from "../service-form";

export default function NewServicePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">New Service</h1>
                <p className="text-sm text-gray-500">
                    Create a new service template for bookings.
                </p>
            </div>
            <ServiceForm />
        </div>
    );
}
