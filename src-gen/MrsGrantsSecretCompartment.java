import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class MrsGrantsSecretCompartment {
	
	public static void main(String[] args) {
		new MrsGrantsSecretCompartment().run();
	}
	
	protected void run() {
		String currentState = "active";
		String lastEvent = null;
		while (true) {
			if (currentState.equals("active")) {
				System.out.println("Your are now in state 'active'. Possible events are [lightOn, drawOpened].");
				lastEvent = receiveEvent();
				if ("lightOn".equals(lastEvent)) {
					currentState = "waitingForDraw";
				}
				if ("drawOpened".equals(lastEvent)) {
					currentState = "waitingForLight";
				}
			}
			if (currentState.equals("idle")) {
				System.out.println("Your are now in state 'idle'. Possible events are [doorClosed].");
				lastEvent = receiveEvent();
				if ("doorClosed".equals(lastEvent)) {
					currentState = "active";
				}
			}
			if (currentState.equals("waitingForLight")) {
				System.out.println("Your are now in state 'waitingForLight'. Possible events are [lightOn].");
				lastEvent = receiveEvent();
				if ("lightOn".equals(lastEvent)) {
					currentState = "idle";
				}
			}
			if (currentState.equals("waitingForDraw")) {
				System.out.println("Your are now in state 'waitingForDraw'. Possible events are [drawOpened].");
				lastEvent = receiveEvent();
				if ("drawOpened".equals(lastEvent)) {
					currentState = "unlockedPanel";
				}
			}
			if (currentState.equals("unlockedPanel")) {
				System.out.println("Your are now in state 'unlockedPanel'. Possible events are [panelClosed].");
				lastEvent = receiveEvent();
				if ("panelClosed".equals(lastEvent)) {
					currentState = "idle";
				}
			}
			if (currentState.equals("name")) {
				System.out.println("Your are now in state 'name'. Possible events are [].");
				lastEvent = receiveEvent();
			}
		}
	}
	
	private String receiveEvent() {
		System.out.flush();
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
		try {
			return br.readLine();
		} catch (IOException ioe) {
			System.out.println("Problem reading input");
			return "";
		}
	}
}
