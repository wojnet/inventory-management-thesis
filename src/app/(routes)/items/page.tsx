"use client";

import ItemList from "@/app/components/items/ItemList/ItemList";

const Items = () => {
  return (
    <div className="w-full min-h-screen p-12 flex flex-col gap-5">
      <h1 className="text-3xl font-bold">Items</h1>
      <p className="max-w-96 text-secondary">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora quidem animi inventore, dicta sunt reiciendis numquam corporis similique laborum.</p>
      <ItemList />
    </div>
  );
};

export default Items;