
# 🛡️ SentryWallet — The Smart Wallet You Can't Lose

## 💡 Inspiration

In the world of Web3, two major hurdles prevent mainstream adoption:

- **Seed Phrase Management**: Users constantly fear losing their seed phrases, which can lead to irreversible loss of funds. This is the single biggest barrier to entry for new users.
- **Complex User Experience**: Managing gas tokens and understanding complex blockchain interactions intimidates users familiar with Web2 simplicity.

**SentryWallet** was created to solve these problems — blending the ease of Web2 with the power of Web3 — all built on the ultra-fast **BlockDAG** network.

---

## ✨ What it Does

**SentryWallet** is a **smart, recoverable crypto wallet** designed for everyday users. It combines security, usability, and self-custody with smart social features.

### ✅ Features

- **Simple Web2 Login (Supabase Auth)**  
  Users sign in using familiar methods like Google — no seed phrases required.

- **On-Chain Inheritance & Social Recovery**  
  Users can assign trusted **nominees** (family, friends) to claim a portion of their wallet during recovery, acting as a digital will.

- **Secure, Password-Protected Wallet**  
  Wallets are generated client-side. Private keys are encrypted with a user password and stored securely in the user’s Supabase profile.

- **Built for BlockDAG**  
  Fully deployed on the **BlockDAG testnet**, leveraging its speed and scalability.

---

## 🚀 How We Built It

### 🔧 Frontend

- **React.js** — Component-based UI
- **Tailwind CSS** — Utility-first styling
- **Ethers.js** — Blockchain interactions
- **Supabase Client** — Authentication & profile storage

### 🗄️ Backend & Database

- **Supabase** — BaaS for auth and storage (PostgreSQL)
- **Row Level Security (RLS)** — Ensures users access only their data
- **JSONB Columns** — Flexible nominee storage

### 🧠 Smart Contract

- **Solidity** — Core inheritance logic
- **SentryInheritance.sol** — Manages nominee shares and fund recovery
- **Deployed on**: BlockDAG testnet

---

## ⚙️ Setup and Installation

### 1. Clone the Repo

```bash
git clone <repository_url>
cd SentryWallet
```

### 2. Set Up Supabase

- Go to [https://supabase.io](https://supabase.io) and create a new project.
- Enable **Google Auth** (or any other providers you want) in **Authentication > Providers**.
- Open the **SQL Editor** and run the following script:

```sql
-- Create the profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  encrypted_wallet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  nominee_data JSONB
);

-- Comments for documentation
COMMENT ON TABLE public.profiles IS 'Stores user profile information, including their encrypted wallet and nominee details.';
COMMENT ON COLUMN public.profiles.id IS 'Foreign key to auth.users.id.';
COMMENT ON COLUMN public.profiles.encrypted_wallet IS 'The user''s wallet, encrypted with their password as a JSON string.';
COMMENT ON COLUMN public.profiles.nominee_data IS 'JSONB array containing nominee objects (address, email, share).';

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view their own profile."
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile."
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Trigger to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

### 3. Deploy the Smart Contract

- Open `SentryInheritance.sol` in [Remix](https://remix.ethereum.org) or your preferred IDE.
- Deploy the contract to the **BlockDAG testnet**.
- Save the **contract address** and **ABI**.

---

### 4. Configure Environment Variables

Create a `.env.local` file in your `frontend/` directory:

```env
REACT_APP_SUPABASE_URL=YOUR_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
REACT_APP_BLOCKDAG_RPC_URL=https://rpc.primordial.bdagscan.com
REACT_APP_INHERITANCE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
```

---

### 5. Install Dependencies & Run Locally

```bash
cd frontend
yarn install
yarn start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛣️ Future Enhancements

- 🔁 **Decentralized Inactivity Trigger**  
  Deploy `SentryInheritanceV2` to replace manual recovery with an on-chain inactivity-based mechanism.

- ⚡ **Gasless Transactions**  
  Integrate a **relayer network** to sponsor gas via meta-transactions.

- 🧾 **Nominee Claim UI**  
  Build a dedicated nominee dashboard for inheritance claims.

- 🔍 **Transaction History**  
  Integrate with BlockDAG explorer API for full wallet history.

- 🌐 **Multi-chain Support**  
  Extend to other **EVM-compatible chains**.

- 📱 **Mobile Apps**  
  Native apps for **iOS** and **Android**.

---

## 🤝 Contributing

We welcome all contributors! 🚀

- Fork the repository  
- Open issues  
- Submit pull requests  

Let’s build the wallet the world needs.

---

## 🧠 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🔗 Links

- 🌐 BlockDAG Testnet: [https://bdagscan.com](https://bdagscan.com)
- 🛠️ Supabase: [https://supabase.io](https://supabase.io)
- 📦 Ethers.js: [https://docs.ethers.io](https://docs.ethers.io)
