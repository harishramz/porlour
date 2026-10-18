export const getServiceOptions = (service) => {
  if (Array.isArray(service.variants) && service.variants.length > 0) {
    return service.variants.map((variant, index) => ({
      ...variant,
      id: variant.id || `option-${index + 1}`,
      priceOnRequest: variant.price == null
    }));
  }

  return [{
    id: 'standard',
    name: 'Standard',
    price: service.price,
    priceOnRequest: service.priceOnRequest ?? service.price == null
  }];
};

export const selectServiceOption = (service, optionId) => {
  const option = getServiceOptions(service).find((item) => item.id === optionId)
    || getServiceOptions(service)[0];
  if (!option) return service;

  return {
    ...service,
    selectedOption: option.name === 'Standard' && !service.variants?.length ? null : option,
    selectedOptionId: option.id,
    price: option.price,
    priceOnRequest: option.priceOnRequest
  };
};

export const getServicePrice = (service) => {
  const prices = getServiceOptions(service)
    .map((option) => option.price)
    .filter((price) => Number.isFinite(price));
  return prices.length ? Math.min(...prices) : null;
};

const variantSuffix = / — (Honey|Rica)$/i;

export const groupLegacyServiceVariants = (services) => {
  const grouped = new Map();

  [...services]
    .sort((left, right) => Number(variantSuffix.test(left.name)) - Number(variantSuffix.test(right.name)))
    .forEach((service) => {
    const match = service.name.match(variantSuffix);
    const baseName = match ? service.name.replace(variantSuffix, '') : service.name;
    const optionName = match?.[1] || 'Standard';
    const initialVariants = service.variants
      ? [...service.variants]
      : match
        ? [{ id: optionName.toLowerCase(), name: optionName, price: service.price }]
        : [];
    const key = `${service.category.toLowerCase()}::${baseName.toLowerCase()}`;
    const current = grouped.get(key);

    if (!current) {
      grouped.set(key, {
        ...service,
        name: baseName,
        shortDescription: match
          ? service.shortDescription?.replace(variantSuffix, '') || baseName
          : service.shortDescription,
        description: match
          ? service.description?.replace(variantSuffix, '') || baseName
          : service.description,
        variants: initialVariants,
        variantIds: [...new Set([...(service.variantIds || []), service.id])]
      });
      return;
    }

    if (!current.variants.length && current.price != null) {
      current.variants.push({ id: 'standard', name: 'Standard', price: current.price });
    }
    if (!current.variants.some((variant) => variant.name.toLowerCase() === optionName.toLowerCase())) {
      current.variants.push({ id: optionName.toLowerCase(), name: optionName, price: service.price });
    }
    if (!current.variantIds.includes(service.id)) current.variantIds.push(service.id);
    if (match?.[1]?.toLowerCase() === 'honey') {
      current.id = service.id;
    }
  });

  return [...grouped.values()].map((service) => {
    if (service.variants.length) {
      const variants = service.variants.map((variant) => ({
        ...variant,
        priceOnRequest: variant.price == null
      }));
      const firstPricedVariant = variants.find((variant) => variant.price != null) || variants[0];
      return {
        ...service,
        variants,
        price: firstPricedVariant?.price ?? null,
        priceOnRequest: firstPricedVariant?.price == null
      };
    }

    return {
      ...service,
      variants: undefined,
      priceOnRequest: service.priceOnRequest ?? service.price == null
    };
  });
};
