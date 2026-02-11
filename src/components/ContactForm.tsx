
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange', // Real-time client-side validation
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);

        // In a real scenario, you would send this to HyperForm or your backend.
        // For demo purposes, we'll simulate a submission delay and redirect.
        // const response = await fetch("YOUR_HYPERFORM_ENDPOINT", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(data)
        // });

        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        window.location.href = '/thanks';
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto bg-transparent">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">お名前</label>
                <input
                    {...register('name')}
                    type="text"
                    id="name"
                    className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="山田 太郎"
                />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">お問い合わせ内容</label>
                <textarea
                    {...register('message')}
                    id="message"
                    rows={5}
                    className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.message ? 'border-red-500' : ''}`}
                    placeholder="お問い合わせ内容をご記入ください..."
                ></textarea>
                {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 text-white font-bold py-4 px-6 rounded-lg hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        送信中...
                    </>
                ) : (
                    '送信する'
                )}
            </button>
        </form>
    );
}

