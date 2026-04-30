'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

type GatewayType = 'none' | 'stripe' | 'custom';

interface StripeCredentials {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
}

interface CustomCredentials {
  gatewayName: string;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  additionalNotes: string;
}

export default function PaymentGatewaySettings() {
  const [selectedGateway, setSelectedGateway] = useState<GatewayType>('none');
  const [savedGateway, setSavedGateway] = useState<GatewayType>('none');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const [stripeCredentials, setStripeCredentials] = useState<StripeCredentials>({
    publishableKey: '',
    secretKey: '',
    webhookSecret: '',
  });

  const [customCredentials, setCustomCredentials] = useState<CustomCredentials>({
    gatewayName: '',
    apiKey: '',
    secretKey: '',
    webhookUrl: '',
    additionalNotes: '',
  });

  const toggleShowSecret = (field: string) => {
    setShowSecrets((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    // Simulate async save
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSavedGateway(selectedGateway);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDisconnect = () => {
    setSelectedGateway('none');
    setSavedGateway('none');
    setStripeCredentials({ publishableKey: '', secretKey: '', webhookSecret: '' });
    setCustomCredentials({ gatewayName: '', apiKey: '', secretKey: '', webhookUrl: '', additionalNotes: '' });
    setShowSecrets({});
  };

  const isFormValid = () => {
    if (selectedGateway === 'stripe') {
      return stripeCredentials.publishableKey.trim() !== '' && stripeCredentials.secretKey.trim() !== '';
    }
    if (selectedGateway === 'custom') {
      return customCredentials.gatewayName.trim() !== '' && customCredentials.apiKey.trim() !== '';
    }
    return false;
  };

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Icon name="CreditCardIcon" size={18} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-600 text-foreground">Payment Gateway</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Connect your own payment gateway to receive payouts directly
            </p>
          </div>
        </div>
        {savedGateway !== 'none' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <span className="text-xs font-500 text-green-700">Connected</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Gateway Selection */}
        <div>
          <p className="text-sm font-500 text-foreground mb-3">Select your payment gateway</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Stripe Option */}
            <button
              onClick={() => setSelectedGateway('stripe')}
              className={`relative flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                selectedGateway === 'stripe' ?'border-blue-500 bg-blue-50/50' :'border-border bg-white hover:border-muted-foreground/30 hover:bg-muted/20'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-[#635BFF]/10 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" fill="#635BFF"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-600 text-foreground">Stripe</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Industry-standard payments. Connect with your Stripe account keys.
                </p>
              </div>
              {selectedGateway === 'stripe' && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Icon name="CheckIcon" size={12} className="text-white" />
                </div>
              )}
            </button>

            {/* Custom / Other Gateway Option */}
            <button
              onClick={() => setSelectedGateway('custom')}
              className={`relative flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                selectedGateway === 'custom' ?'border-accent bg-accent/5' :'border-border bg-white hover:border-muted-foreground/30 hover:bg-muted/20'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Icon name="BuildingLibraryIcon" size={20} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-600 text-foreground">Other / Custom Gateway</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  PayPal, Flutterwave, Paystack, or any preferred gateway.
                </p>
              </div>
              {selectedGateway === 'custom' && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <Icon name="CheckIcon" size={12} className="text-white" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Stripe Credentials Form */}
        {selectedGateway === 'stripe' && (
          <div className="space-y-4 fade-in">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-500 text-muted-foreground uppercase tracking-wider px-2">
                Stripe Credentials
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 flex items-start gap-2">
              <Icon name="InformationCircleIcon" size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                Find your API keys in the{' '}
                <a
                  href="https://dashboard.stripe.com/apikeys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-500"
                >
                  Stripe Dashboard → Developers → API keys
                </a>
                . Use your own account keys — payouts go directly to you.
              </p>
            </div>

            {/* Publishable Key */}
            <div>
              <label className="block text-xs font-500 text-foreground mb-1.5">
                Publishable Key <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showSecrets['stripe_pub'] ? 'text' : 'password'}
                  value={stripeCredentials.publishableKey}
                  onChange={(e) =>
                    setStripeCredentials((prev) => ({ ...prev, publishableKey: e.target.value }))
                  }
                  placeholder="pk_live_..."
                  className="input-field pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => toggleShowSecret('stripe_pub')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={showSecrets['stripe_pub'] ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
                </button>
              </div>
            </div>

            {/* Secret Key */}
            <div>
              <label className="block text-xs font-500 text-foreground mb-1.5">
                Secret Key <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showSecrets['stripe_secret'] ? 'text' : 'password'}
                  value={stripeCredentials.secretKey}
                  onChange={(e) =>
                    setStripeCredentials((prev) => ({ ...prev, secretKey: e.target.value }))
                  }
                  placeholder="sk_live_..."
                  className="input-field pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => toggleShowSecret('stripe_secret')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={showSecrets['stripe_secret'] ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
                </button>
              </div>
            </div>

            {/* Webhook Secret */}
            <div>
              <label className="block text-xs font-500 text-foreground mb-1.5">
                Webhook Secret{' '}
                <span className="text-muted-foreground font-400">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type={showSecrets['stripe_webhook'] ? 'text' : 'password'}
                  value={stripeCredentials.webhookSecret}
                  onChange={(e) =>
                    setStripeCredentials((prev) => ({ ...prev, webhookSecret: e.target.value }))
                  }
                  placeholder="whsec_..."
                  className="input-field pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => toggleShowSecret('stripe_webhook')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={showSecrets['stripe_webhook'] ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Required for receiving real-time payment event notifications.
              </p>
            </div>
          </div>
        )}

        {/* Custom Gateway Credentials Form */}
        {selectedGateway === 'custom' && (
          <div className="space-y-4 fade-in">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-500 text-muted-foreground uppercase tracking-wider px-2">
                Gateway Credentials
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 flex items-start gap-2">
              <Icon name="InformationCircleIcon" size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Enter your gateway name and credentials. These are stored securely and used only for your account payouts.
              </p>
            </div>

            {/* Gateway Name */}
            <div>
              <label className="block text-xs font-500 text-foreground mb-1.5">
                Gateway Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customCredentials.gatewayName}
                onChange={(e) =>
                  setCustomCredentials((prev) => ({ ...prev, gatewayName: e.target.value }))
                }
                placeholder="e.g. PayPal, Flutterwave, Paystack..."
                className="input-field text-sm"
              />
            </div>

            {/* API Key */}
            <div>
              <label className="block text-xs font-500 text-foreground mb-1.5">
                API Key / Client ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showSecrets['custom_api'] ? 'text' : 'password'}
                  value={customCredentials.apiKey}
                  onChange={(e) =>
                    setCustomCredentials((prev) => ({ ...prev, apiKey: e.target.value }))
                  }
                  placeholder="Your public API key or client ID"
                  className="input-field pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => toggleShowSecret('custom_api')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={showSecrets['custom_api'] ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
                </button>
              </div>
            </div>

            {/* Secret Key */}
            <div>
              <label className="block text-xs font-500 text-foreground mb-1.5">
                Secret Key / Client Secret{' '}
                <span className="text-muted-foreground font-400">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type={showSecrets['custom_secret'] ? 'text' : 'password'}
                  value={customCredentials.secretKey}
                  onChange={(e) =>
                    setCustomCredentials((prev) => ({ ...prev, secretKey: e.target.value }))
                  }
                  placeholder="Your secret key"
                  className="input-field pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => toggleShowSecret('custom_secret')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={showSecrets['custom_secret'] ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
                </button>
              </div>
            </div>

            {/* Webhook URL */}
            <div>
              <label className="block text-xs font-500 text-foreground mb-1.5">
                Webhook / Callback URL{' '}
                <span className="text-muted-foreground font-400">(optional)</span>
              </label>
              <input
                type="url"
                value={customCredentials.webhookUrl}
                onChange={(e) =>
                  setCustomCredentials((prev) => ({ ...prev, webhookUrl: e.target.value }))
                }
                placeholder="https://your-gateway.com/webhook"
                className="input-field text-sm"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs font-500 text-foreground mb-1.5">
                Additional Notes{' '}
                <span className="text-muted-foreground font-400">(optional)</span>
              </label>
              <textarea
                value={customCredentials.additionalNotes}
                onChange={(e) =>
                  setCustomCredentials((prev) => ({ ...prev, additionalNotes: e.target.value }))
                }
                placeholder="Any extra configuration details, environment (sandbox/live), or notes for your gateway setup..."
                rows={3}
                className="input-field text-sm resize-none"
              />
            </div>
          </div>
        )}

        {/* Security Note */}
        {selectedGateway !== 'none' && (
          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
            <Icon name="LockClosedIcon" size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your credentials are encrypted and stored securely. They are never shared with other producers or third parties. Only you can view or update them.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {selectedGateway !== 'none' && (
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving || !isFormValid()}
                className="btn-primary text-sm py-2 px-5"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Icon name="CheckIcon" size={15} />
                    Save Gateway
                  </>
                )}
              </button>

              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-green-600 fade-in">
                  <Icon name="CheckCircleIcon" size={16} />
                  <span className="text-sm font-500">Saved successfully</span>
                </div>
              )}
            </div>

            {savedGateway !== 'none' && (
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-500 transition-colors"
              >
                <Icon name="XCircleIcon" size={15} />
                Disconnect
              </button>
            )}
          </div>
        )}

        {/* Empty state when no gateway selected */}
        {selectedGateway === 'none' && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Icon name="CreditCardIcon" size={22} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-500 text-foreground">No gateway connected</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Select a payment gateway above to enter your credentials and start receiving payouts directly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
