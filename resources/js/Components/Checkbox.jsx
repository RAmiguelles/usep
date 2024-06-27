export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-primary-light shadow-sm focus:ring-primary-dark ' +
                className
            }
        />
    );
}
