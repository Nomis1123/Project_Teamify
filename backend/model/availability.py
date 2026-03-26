DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
TIMES = ["morning", "afternoon", "evening"]
BITS = 21

class Availability:

    def __init__(self, availability_dict: dict|None=None, bits: int|None=None):
        """
        Expects a dict like:
        {
            "monday":    {"morning": True, "afternoon": False, "evening": True},
            "tuesday":   {"morning": False, "afternoon": True, "evening": False},
            ...
        }
        Bit order: monday-morning is MSB, sunday-evening is LSB.
        """

        self.bits: int = 0

        if availability_dict is not None:
            for day in DAYS:
                for time in TIMES:
                    self.bits <<= 1
                    if availability_dict.get(day, {}).get(time, False):
                        self.bits |= 1
        elif bits is not None:
            self.bits = bits


    def to_dict(self) -> dict:
        '''
        Return a dictionary representation of the bits.

        Returns a dict like:
        {
            "monday":    {"morning": True, "afternoon": False, "evening": True},
            "tuesday":   {"morning": False, "afternoon": True, "evening": False},
            ...
        }
        '''
        result = {}
        mask = 1 << (BITS - 1)  # start at the MSB
        for day in DAYS:
            result[day] = {}
            for time in TIMES:
                result[day][time] = bool(self.bits & mask)
                mask >>= 1
        return result

    def __repr__(self):
        '''
        Return a string representation of the bits.
        '''
        return f"Availability(bits={self.bits:021b})"
