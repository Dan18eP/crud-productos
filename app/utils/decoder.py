from decimal import Decimal

def decode_dynamodb_item(item):
    """
    Recursively converts DynamoDB Decimals to float or int.
    """
    if isinstance(item, list):
        return [decode_dynamodb_item(v) for v in item]
    elif isinstance(item, dict):
        return {k: decode_dynamodb_item(v) for k, v in item.items()}
    elif isinstance(item, Decimal):
        if item % 1 == 0:
            return int(item)
        else:
            return float(item)
    return item
