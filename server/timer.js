export default class timer {
	sec = 0;
	min = 0;
	hrs = 0;
	t = 0;

	addTime() {
		this.sec++;
		if (this.sec >= 60) {
			this.sec = 0;
			this.min++;
			if (this.min >= 60) {
				this.min = 0;
				this.hrs++;
			}
		}
	}

	getSec() {
		return this.sec;
	}

	getMin() {
		return this.min;
	}

	getHrs() {
		return this.hrs;
	}

	getTotalTime() {
		return this.hrs * 3600 + this.min * 60 + this.sec;
	}
}
